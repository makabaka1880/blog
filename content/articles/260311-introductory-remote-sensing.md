---
title: Introductory Remote Sensing
description: A programmer's introduction to multispectral satellite data, spectral indices, and pseudocolor rendering with Sentinel-2.
createTime: 2026-03-11
updateTime: 2026-03-11
---

::QuoteBox
---
source: "Paul Valéry"
---
"To see is to forget the name of the thing one sees."
::

I first picked up remote sensing for our IMMC 2026 project, and was surprised to find it as much a software engineering discipline as a scientific one — working with satellite data means writing pipelines, wrangling geospatial formats, and processing gigabytes of raster data in code. This article is a brief, practical introduction to the core ideas, written for programmers who are curious about what satellites actually see and how we turn that into something useful.

> This entry is mainly focused on spectral indices collected from satellites. Later on maybe I'll do a project on UAV remote sensing, but right now I don't have the resource to do so.
> 
> For intermediate applications, check out [my entry on our work](/260311-immc-reflection), and hope you enjoy it!

::LinkCard
---
url: "https://dataspace.copernicus.eu"
title: "Copernicus Data Space Ecosystem | Europe's eyes on Earth"
details: "Welcome to the Copernicus Data Space Ecosystem, an open ecosystem that provides free instant access to a wide range of data and services from the Copernicus Sentinel missions and more on our planet's land, oceans and atmosphere."
image: "CDSE.webp"
---
::

We'll be using the **Copernicus Data Space Ecosystem** and its Sentinel-2 L2A satellite as our running example throughout.

## 0x00. Multispectral Data and Bands

To understand what we can extract from satellite imagery, we first need to understand **bands**, **multispectral data**, and **indices**.

Our normal camera shoots images in Red (~665 nm), Green (~560 nm) and Blue (~490 nm) bands. This composites an image in a color mode known as **RGB**. Cameras are essentially electromagnetic wave detectors — they measure how much energy a surface reflects at specific wavelengths. Our eyes happen to be most sensitive to three ranges of visible light, which we perceive as red, green, and blue; by a basic spanning argument, any color visible to humans can be composed from these three. Satellites take this further, capturing dozens of bands well beyond visible light — many of which we cannot see, but which reveal information about the surface that RGB simply cannot.

In remote sensing, we use the word **band** over *channel* to avoid ambiguity with its software counterpart.

::DefBox{id="Multispectral Data"}
**Multispectral data** refers to imagery captured across multiple discrete bands of the electromagnetic spectrum — not just visible light, but also near-infrared (NIR), red-edge, and shortwave infrared (SWIR). Each band captures how strongly a surface reflects or emits energy at that wavelength, revealing properties invisible to the naked eye — vegetation health, water content, soil salinity, and more.
::

:::Folding{title="Bands and corresponding wavelength (S2L2A)"}
| Band | Common Name | Wavelength (S2A / S2B) | Resolution |
|------|-------------|------------------------|------------|
| B01 | Coastal Aerosol | 442.7 nm / 442.3 nm | 60m |
| B02 | Blue | 492.4 nm / 492.1 nm | 10m |
| B03 | Green | 559.8 nm / 559.0 nm | 10m |
| B04 | Red | 664.6 nm / 665.0 nm | 10m |
| B05 | Red Edge (RE1) | 704.1 nm / 703.8 nm | 20m |
| B06 | Red Edge (RE2) | 740.5 nm / 739.1 nm | 20m |
| B07 | Red Edge (RE3) | 782.8 nm / 779.7 nm | 20m |
| B08 | NIR | 832.8 nm / 833.0 nm | 10m |
| B8A | Narrow NIR | 864.7 nm / 864.0 nm | 20m |
| B09 | Water Vapour | 945.1 nm / 943.2 nm | 60m |
| B11 | SWIR 1 | 1613.7 nm / 1610.4 nm | 20m |
| B12 | SWIR 2 | 2202.4 nm / 2185.7 nm | 20m |
| AOT | Aerosol Optical Thickness | — | 10m |
| SCL | Scene Classification | — | 20m |
| SNW | Snow Probability | — | 20m |
| CLD | Cloud Probability | — | 20m |
:::

## 1x00. Fetching Data with SentinelHub

Now that we understand what bands are, we actually need to fetch some. To process remote sensing data, we first supply a bounding geometry for SentinelHub to fetch. Here, I have a geojson containing the geometry of Etosha National Park's boundary, downloaded from ProtectedPlanet:

::LinkCard
---
url: "https://www.protectedplanet.net/884"
title: "Explore the World's Protected Areas | Etosha National Park"
details: "Protected Planet is the most up to date and complete source of data on protected areas and other effective area-based conservation measures (OECMs), updated monthly with submissions from governments, non-governmental organizations, landowners and communities."
image: "protected-planet.webp"
---
::

::Folding{title="Listing a.1 - Set Up Geometry Bounding Box"}
```py
import sentinelhub as sh

BOUNDARY_PATH = "area.geojson"

path = json.load(open(BOUNDARY_PATH, "r"))

max_x = -1000
max_y = -1000
min_x = 1000
min_y = 1000

# Use a rolling extrema loop to find bbox
for point in path["features"][0]["geometry"]["coordinates"][0][0]:
    max_x = max(max_x, point[0])
    min_x = min(min_x, point[0])
    max_y = max(max_y, point[1])
    min_y = min(min_y, point[1])

bbox = sh.BBox((min_x - 0.1, min_y - 0.1, max_x + 0.1, max_y + 0.1), sh.CRS.WGS84)
size = sh.bbox_to_dimensions(bbox, resolution=150)
```
If you don't have a geometry and just want a bounding box, just use a python tuple of `(min_lon, min_lat, max_lon, max_lat)` in line 19.
::

Then we provide our credentials, the bounding geometry, and a preprocessing script known as an *evalscript* to the server.

::Folding{title="Listing a.2 - Set Up SentinelHub Request"}
```py
EVALSCRIPT_PATH="scripts/truecolor.js"
START_DATE="2022-04-24"
END_DATE="2022-04-28"

config = sh.SHConfig()
config.sh_token_url = "https://identity.dataspace.copernicus.eu/auth/realms/CDSE/protocol/openid-connect/token"
config.sh_base_url = "https://sh.dataspace.copernicus.eu"
config.sh_client_id = "sh-....."
config.sh_client_secret = "....."
config.save("IMMC")

with open(EVALSCRIPT_PATH, "r") as f:
    req_true_color = sh.SentinelHubRequest(
        evalscript=f.read(),
        input_data=[
            sh.SentinelHubRequest.input_data(
                data_collection=sh.data_collections.DataCollection.SENTINEL2_L2A.define_from(
                    'SENTINEL2-L2A-COPERNICUS', service_url=config.sh_base_url
                ),
                time_interval=(START_DATE, END_DATE),
            )
        ],
        responses=[
            sh.SentinelHubRequest.output_response("default", sh.MimeType.PNG)
        ],
        bbox=bbox,
        size=size,
        config=config,
    )
```
::

Those of you with experience writing shaders might recognize the evalscript pattern immediately — it is essentially a fragment shader: for each pixel, you designate how to compute its output value. In the next section we will take an concrete example.

## 2x00. Truecolor and Pseudocolor Rendering

First of all, let's draw what the satellite sees in the visible spectrum. From the band table above we can pick `B02`, `B03`, and `B04` and map them to our `R`, `G`, and `B` channels because they correspond in wavelength.

> Yep, we still use the term *channels* in color science. It's important to distinguish between *channels* and *bands*: they are technically the same thing, but channels generally refer to things meant for human perception, while bands are pure scalar fields meant to be processed and interpreted.

::Folding{title="Listing a.3 - truecolor.js"}
```js
//VERSION=3

function setup() {
    return {
        input: ['B02', 'B03', 'B04', 'dataMask'],
        output: { bands: 4 },
    };
}

function evaluatePixel(sample) {
    return [sample.B04, sample.B03, sample.B02, sample.dataMask];
}
```
`dataMask` here is a special band for cropping out unused data. In rendering, it maps to the `alpha` channel, which corresponds to *opacity*.
::

Now we run the request:
```py
import numpy as np;
import matplotlib.pyplot as plt;

img = req_true_color.get_data()[0];
plt.imshow(img[:, :, :3]);  # Strip the dataMask channel
plt.show();
```

Now we get a vector field $\mathbb{R}^2 \to [0, 1]^4$ in the form of a `numpy.ndarray` — a 3-ranked tensor whose first two indices correspond to the $x$ and $y$ position of a pixel, and the last a selector to the `R`, `G`, `B`, and $\alpha$ channels.

This type of rendering is called **truecolor** — it maps electromagnetic information into channels that portray how a human would actually see the scene. This naturally leads to a question: can we map other bands into channels that don't physically correspond?

The graphed result will look like this:

::Pic
---
src: "truecolor.webp"
alt: "TrueColor - Etosha National Park of Namibia, 2024.04.24 - 2024.04.28, Stacked"
---
::

Note that we did not use the vanilla truecolor evalscript directly. In its most primitive form, the raw output is not tuned for the human eye — so nonlinear transformations are applied, producing what is known as an **Enhanced Truecolor Map**, optimized for human aesthetics and optics. Consider checking out this paper:

:LinkCard{url="https://www.sciencedirect.com/science/article/pii/S0034425719300422" title="Natural color representation of Sentinel-2 data - ScienceDirect" details="The true color composite is a widely used Earth observation product for displaying satellite imagery. As it is often used in communication with non-ex…" image="sciencedirect.webp"}

YES, we can also map other bands into channels that don't physically 
correspond! Take $(\mathbb{B}12, \mathbb{B}08) \mapsto (\mathbb{B}08, 
\mathbb{B}12, \mathbb{B}12)$:

::Pic
---
src: "cir.webp"
alt: "Composed InfraRed - Etosha National Park of Namibia, 2024.04.24 - 2024.04.28, Stacked"
---
::

This is a **pseudocolor** rendering of the park. Regions of high <mark>near-infrared reflectance</mark> appear red, and regions of high <mark>short-wave infrared reflectance</mark> appear teal. The practice of compositing pseudocolor images from IR bands is called **Infrared Photography**, and the results are called **Composed InfraReds** (CIRs).

::Folding{title="Listing a.4 - cir.js"}
```js
//VERSION=3
function setup() {
    return {
        input: ["B12", "B08"],
        output: { bands: 3 }
    };
}

function evaluatePixel(sample) {
    const gamma = val => Math.pow(val, 0.6);
    return [gamma(sample.B08), gamma(sample.B12), gamma(sample.B12)];
}
```
::

## 3x00. Spectral Indices

Outside of photography and artistic use, those non-visible bands are of far more practical value. Scientists exploit the fact that different materials absorb and reflect specific wavelengths in predictable ways — and by taking ratios of carefully chosen bands, we can construct **indices** that measure specific surface properties with a single number per pixel.

::DefBox{id="Normalized Difference Indices"}

Most indices are ratios that correlate positively to one band and negatively to another, of the form:
$$
\text{ND}(A, B) = \frac{A - B}{A + B}
$$
This ratio always lies in $[-1, 1]$, normalized so that absolute brightness differences due to illumination don't skew the result. Here is an interactive Desmos model of a general ND index:
<iframe src="https://www.desmos.com/3d/dhgqfwcgdh?embeded"></iframe>

::

For example, chlorophylls absorb red light — which is precisely why plants appear green. At the same time, chlorophylls reflect infrared strongly to prevent plants from overheating. Biologists observed a sharp drop in absorptance at the boundary between these two regimes, known as the **Red Edge**.

::Pic
---
src: "Chlorophyll_ab_spectra-en.webp"
alt: "Chlorophyll absorbance across the spectrum"
---
::

Therefore, a metric positively correlated to infrared and negatively to red-edge can measure chlorophyll concentration, thus representing vegetation health. The **NDRE** (Normalized Difference Red Edge) index is thus what we want:
$$
\rho_{\text{NDRE}} = \frac{\mathbb{B}08 - \mathbb{B}05}{\mathbb{B}08 + \mathbb{B}05}
$$

::Pic
---
src: "787265e9-000b-42c4-8c27-67729e5f2285.webp"
alt: "NDRE with σ=2 gaussian denoising, quantized at 5 levels"
---
::

Here we compute a <mark>contour</mark> of the index — a method of quantizing values to a set of discrete levels to divide the domain into several classes, as shown by the different shades of green above.

There are all sorts of other indices beyond NDRE. A comprehensive reference is available at IndexDB:

::LinkCard
---
url: "https://www.indexdatabase.de"
title: Index DataBase
details: A database for remote sensing indices.
image: "idb.webp"
---
::


## 0x05. Conclusion
For those who want to exploring the fascinating world of RS, here's a link to a journel we extensively referenced in our project:

::LinkCard
---
url: "https://www.mdpi.com/journal/remotesensing"
title: "Remote Sensing | Open Access Journal | MDPI"
details: "Remote Sensing, an international, peer-reviewed, Open Access journal."
image: "mdpi.webp"
---
::
Being a subjournel of MDPI, it is completely free and really helped a lot.

In this entry I only introduced spectral indices, but actually there are a lot more to remote sensing. For example, here is a parallax window rendered using DEM data as depth map:

::ParallaxWindowMousetrack
---
albedo: "truecolor.webp"
depth: "dem.webp"
sensitivity-y: 0.01
sensitivity-x: 0.03
view-height: 0.2
---
::

Remote sensing is a vast subject and honestly, pretty fascinating. I first came over the concept of RS in freshman high school geography. Back than, I have no appreciation of what it is; to me, it was just another vocabulary to be swept to the back of my mind at the end of the semester. Only on this opportunity did RS revealed its true depth; the mesmorizing ability to let us preceive the landscape beyond what our biology allows crystallized upon me as a visual artist and computer science student. 

Advancements in technology are always fascinating, especially those which we can transform into beauty that our aesthetics can intuitively accept and appreciate. To me, this process of transformation is always the most beautiful.