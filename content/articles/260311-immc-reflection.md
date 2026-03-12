---
title: Eyes Over Etosha - A Modeling Marathon
description: Reflection on the recent IMMC international round
createTime: 2026-03-11
updateTime: 2026-03-11
---

::QuoteBox{source="Richard Hamming"}
The purpose of computing is insight, not numbers.
::

Our fantastic team just finished IMMC26 International Round; as the lead coder I was in charge of some pretty interesting simulations and visualizations.

:Pic{src="Screenshot 2026-03-11 at 18.19.39.webp" alt="2125 lines of python in 50 hours"}

We collected quite a lot of interesting artifacts, for example among them are 3GB of Sentinel Satellite data from all across africa and all 200k+ existing occurence entries of the African Elephant from GBIF.

:Pic{src="Screenshot 2026-03-11 at 18.22.17.webp" alt="Sneak peak at our paper"}
:Pic{src="6133539aa13b0c2ef181af28c8ec4b66.webp" alt="Our favourite vis"}

But most importantly, we had a great time! In this post, I'll walk through some of our most interesting work, and share an honest reflection on what it was like to live through the exhausting, thrilling, and ultimately unforgettable 50 hours.

:Pic{src="Screenshot 2026-03-11 at 18.35.21.webp" alt="International Masochastic Modeling Competition™ - Pushing your vitals to the limit"}

## 0x00. Remote Sensing, SDFs and SentinelHub
Originally, when we first saw the problem, our instinct was to discretize the  map into whatever data structure felt most natural. After some probing, this turned out to be completely infeasible — the discrete nodes would essentially have to sit at the lattice intersections of every covariate we were analyzing, and the resulting data volume would be enormous. We were stuck.

Then, while ordering evening snacks, I accidentally toggled on the satellite view. That's when it hit me: satellite maps *already* discretize terrain into pixels, and each pixel contains exactly the kind of spatially-indexed data we needed. I quickly shared this $\varepsilon\acute{\upsilon}\rho\eta\kappa\alpha!$ moment with the team, and we immediately turned to Google Maps - only to hit another wall.

:Pic{src="Screenshot 2026-03-12 at 00.37.28.webp" alt="Google Maps locks everything behind a paywall. We are poor high school students who can barely afford a sandwich after school *sniffle*"}

However, one particular data layer caught my eye: the **Copernicus DEM GLO-30**. Based on the name alone, my developer instincts told me this was open-sourced, or at least open-API. I was right.

:LinkCard{url="https://dataspace.copernicus.eu/data-collections" title="Data Collections | Copernicus Data Space Ecosystem" details="Copernicus Data Space Ecosystem - Europe's eyes on Earth" image="CDSE.webp"}

What followed was a tedious hour and a half of learning the SentinelHub API, plus another thirty minutes hunting for where the sign-up portal was actually hidden. Meanwhile the team was still coordinating entirely asynchronously - but through the chaos, the basic covariate structure had started to take shape:

::Chat

{:3/5 22:14}

{HRX}

比如旱季山火

{JYZ}

yeah分季节和分地区

{HRX}

地区怎么办

坐标系吗。

{.LCX}

(物种遥感看不见的得另外找数据

{JYZ}

盐沼区森林区草原区呗

{.LCX}

(植被和山火可以

{JYZ}

额我的意思是指标线算出来一个分数呀关于这个事件

然后你再去地图看位置

给系数嘛

{HRX}

哦有道理

::

Finally, after two hours of toil, our first satellite image came through.

> At the time I was very unfamiliar with numpy and tensors — it took me five minutes just to work out the indexing logic for stripping the alpha channel. During the national round I had used R for all data processing, so the transition from relational algebra to tensor arithmetic was a genuine headache.

:Pic{src="Screenshot 2026-03-12 at 00.57.00.webp" alt="Etosha After the Fire, True Color"}

It was unenhanced, poorly declouded, and I hadn't even bothered to rename the variable from my previous DEM fetch - but it was progress.

## 1x00. The Variables, TexPage, and Board Games

After some friction we finally settled on the final model architecture: establish a correlation between environmental covariates like NDRE and NDWI and hazardous events like poaching, disease, or wildfire; compute an overall threat score from all those events; then perform some sort of partitioning to allocate patrol ranges for the rangers. I don't really know how they allocated the cameras and did the budget modeling - that was someone else's problem.

Now you ask how do you settle the correlation? Well everyone is too lazy, AHP! How do we compose all those events? AHP! If it wasn't for GBIF, we would've been the first team ever to create a linear model for animal density dependent on spectral indices. AHP alone took up 50% of our previous paper in the national round, which is quite surprising considering that it actually made it up to Mediocre. Again, no one knew, maybe it was an outstanding 🤷

> For the record, we *are* apparently the only team I've heard of that made it through the national round on a pure linear model.
>
> Perhaps the only genuinely novel contribution of that paper was that our model flagged the day before Trump's attack on Venezuela as an exceptionally lucky day. 
>
> We are not available for consulting. Thank you, Pentagon.
>
> <img src="/assets/260311-immc-reflection/Screenshot 2026-03-12 at 20.50.31.webp" style="width: 100%;"/>

Our team has a tradition of selecting the most cryptic and bizarre Greek letters for all our variables. Last time, we used $\Xi$ for day modulo a period - and instead of using subscripts to denote the periods, we subscripted $\Xi$ *to* the periods, like $7_\Xi$ and $31_\Xi$. It was hilarious, and somehow didn't faze the national judges, who let us through anyway. Looking back, they were probably just passing the trauma downstream to the international judges.

::Chat
{:2-28 20:54}

{HRX}

@所有人 我们进决赛了

![](/assets/260311-immc-reflection/b2a33b85f3281599fdc675258e92fbc2.webp)

{JYZ}

刚出的？

{HRX}

对

{JYZ}

ok

{HRX}

牛了个大逼

{.LCX}

👀

{HRX}

我真不行了

就我那个结论

《运气不存在》

{.LCX}

![](/assets/cat-smiling-emoji.webp) <br/>
草太难蚌了
::

The same goes for this paper. I never did and I think I will never again describe a notation convention as prose -
**but who the heck else could come up with using integers as placeholders for variables based on their order of introduction?**

::Pic
---
src: "Screenshot 2026-03-12 at 01.31.28.webp"
alt: "Utterly Inhuman"
---
::

Luckily, I was not in charge of implementing that section.

My high school offers a discrete mathematics course, and given its high correlation with modeling, it's no surprise that most competition participants have taken it. What is perhaps more surprising is that at least half the class plays Riichi Mahjong — earning the course its unofficial title: the "underground casino". The professor, for the record, is the best player in the class. I am one of the very few students not in the casino, but all of my teammates are, and are pretty decent players.

Now, the SIR model tells us that the speed of infection is proportional to the number of infected individuals. And so, one night, one of my teammates decided to induct me into the casino - starting me off against a very weak computer opponent. This gave me some wholly unwarranted self-confidence, which promptly evaporated in my first human matchup. I never touched the casino again for the rest of the competition. That teammate probably just wanted to boost my productivity.

> He actually got a Junsei Chuuren Poutou and a double yakuman later on and almost literally flied off the table.

## 2x00. Signed Distance Fields, Water Proximity, and Elephants
::Hintbox
For those of you not familiar with remote sensing, I would recommend checking out [my blog post](/260311-introductory-remote-sensing) on introductory remote sensing. Or else you'll have an headache reading the following section.
::

The best part of the model is feature engineering. From Sentinel we extracted four major indices that we utilized: `NDWI` (waterbody), `NDRE` (vegetation), `NDSI` (saline) and `DEM` (altitude). The two features our AHP guy asked me to engineer were **animal density** and **water proximity**. At the time I figured that it'll be pretty fun to do one out of pure hueristics and another pure mathematics, so that's what I did: I trained an XGBoost on occurence data of African Elephants for animal density and used a non-euclidean geodesic SDF to the zero-contour of `NDWI` for water proximity, and surprisingly they worked out very well!

### 2x01. Animal Density
For this I decided to go full machine learning.

:Pic{src="Screenshot 2026-03-12 at 08.11.28.webp" alt="Datasets we downloaded from gbif"}



::LinkCard
---
url: "https://www.gbif.org/occurrence/download/0020871-260226173443078"
title: "DOI"
details: "10.15468/dl.jhnzet"
image: "doiorg.webp"
---
::

::LinkCard
---
url: "https://www.gbif.org/occurrence/download/0020868-260226173443078"
title: "DOI"
details: "10.15468/dl.d5h5gd"
image: "doiorg.webp"
---
::

Ecological datasets, like GBIF, often contain data only for occurence records. Therefore, we need to manually aggregate records by occurences and tally up the occurences. Because of our purposes we binned the data up by their coordinates rounded to the closest digits. Because we haven't the time and computation power we did not account for varying geographic convariances over a year. Even though this made the model less robust but it still turned out to suffice for our purposes.

```r
df <- df |> mutate(
    latBin = round(decimalLatitude),
    lonBin = round(decimalLongitude)
) |> group_by(latBin, lonBin) |> summarise(
    freq = n()
)
```

For each coordinate bin, we fetch the average of the spectral indices over those $1 \degree \times 1\degree$ grid. Then we obtain this dataframe that couples spectral data with coordinates. At first, I tried using MLPs (basically alternatingly applying linear models and nonlinear functions lots of times) but it was horrendous. The good thing is that the loss converges. The bad thing is it converged at `2135.30`.

::Chat

{:On Meeting}

{.LCX}

彳亍

{.LCX}

<img src="/assets/260311-immc-reflection/Screenshot 2026-03-12 at 19.03.44.webp"/>

{QZC}

WTF

::

After some researching and LLM torturing we finally did get a decent result using XGBoost.

:Pic{src="d531e62a-7e9b-4f2e-a76a-66abb0caee89.webp" alt="Even though it seems like nowhere near converging we did got a knee point in RMSE at n=50 so we stopped here"}

And the results were pretty amazing: it correctly predicted high clustering of animals near the waterhole and the western woods, but some false positives did pop up on the northeastern edge and the salt pan. We suspected it was mostly because of the lack of data for high-salinity terrains.

:Pic{src="6d485e94-f382-4b08-bfb5-afef1083c518.webp" alt="Gaussian Smoothed (σ=2) Normalized Population Density, contours at 5 levels"}

### 2x02. Water Proximity

::WarningBox
Heavy mathematics ahead. If you're uncomfortable with this, jump right ahead to [the next section](#_3x00-composition-and-the-24h-countdown)
::

We had a lot of thought on this one. At first, we interpreted NDWI as a fuzzy geometry over the terrain and went over many integrals, but  none of them seemed to be anything but degenerate. At last, we decided to derive a clear boundary for waterbodies and utilize a noneuclidean SDF for waterbody proximity. 

A remote sensing convention is to treat region where $\rho_W > 0$ as waterbodies. Therefore we computed a numpy mask `mask = ndwi > 0;` and used that as the waterbody geometry. Now we can define an SDF.

> Here we actually ran into a bug of jupyternotebook; when we load multiple ndarrays into the environment in a specific order, applying `scipy.ndimage.gaussian_filter` yields unusual artifacts that severly interfered with subsequent analysis. We managed to get around that, but I'll still appreciate any solution. If you've got one, leave it down in the comments.

SDF is a scalar field that describes the closest distance from a point to any point on a geometry. That is,
$$
u(p) = \min_{q \in \partial \Omega} ||p - q||
$$

As we get further away from an object, the distance grows at a perfectly uniform rate -- one unit of distance per one unit of space traveled. This pattern is described by a crucial differential equation known as the Eikonal Equation:

$$
    |\nabla u| = s
$$

::Hintbox
Intuitively, $\nabla u$ is the gradient vector of the distance field—it points in the direction of steepest increase in distance, i.e., directly away from the nearest boundary point. The parameter $s$ represents the **local slowness** (the reciprocal of speed) of the distance propagation. While a standard Euclidean distance assumes $s = 1$, where walking one step in the gradient direction increases your distance-to-water by exactly one step, keeping $s$ as a variable allows for significant extensibility. In this context, $s$ acts as a **cost weight** or a "refractive index" for the terrain. A higher value of $s$ effectively "stretches" the accumulated distance $u$ relative to the physical space traveled, allowing us to model regions where movement is more taxing - such as thick vegetation, mud, or steep slopes—without altering the underlying geometry.
::

For etosha and other flat terrains, this version is already enough. But in our paper we decided to go a step further, and introduced a geodesic approach to incoporate altitude data. On non-euclidean manifolds the elegant eikonal become slightly more intricate:

$$
    g^{ij} \frac{\partial u}{\partial x^i} \frac{\partial u}{\partial x^j} = s^2 
$$

Where $g^{ij}$ is the metric tensor. I don't know much multivariable calculus, so in our paper we made this convenient assumption:

:Pic{src="Screenshot 2026-03-13 at 00.20.52.webp" alt="Independece Assumption"}

This basically set $g_{\phi\lambda} = g_{\lambda\phi} = 0$ and the metric tensor becomes diagonal:

$$
    g_{ij} = \begin{pmatrix} g_{\lambda\lambda} & 0 \\ 0 & g_{\phi\phi} \end{pmatrix}
$$

and the equation simplifies to its additive form:

$$
    \left(\frac{u_{i,j} - A}{dl_x}\right)^2 + \left(\frac{u_{i,j} - B}{dl_y}\right)^2 = s^2
$$

By substitution and collecting terms, the update rule emerges from the quadratic:

$$
(dl_x^2 + dl_y^2)\, u^2 - 2(dl_y^2 A + dl_x^2 B)\, u + (dl_y^2 A^2 + dl_x^2 B^2 - s^2 dl_x^2 dl_y^2) = 0
$$

Solving yields the 2D update:

$$
u_{i,j} = \frac{dl_y^2 A + dl_x^2 B + dl_x \cdot dl_y \sqrt{s^2(dl_x^2 + dl_y^2) - (A - B)^2}}{dl_x^2 + dl_y^2}
$$

::Hintbox
As a sanity check: when $dl_x = dl_y = dl$, this cleanly reduces to the classical isotropic Euclidean update:
$$
u_{i,j} = \frac{A + B + \sqrt{2 s^2 dl^2 - (A - B)^2}}{2}
$$
::

However, this 2D update is only valid when the discriminant is non-negative. When the two upwind neighbors $A$ and $B$ are too far apart in accumulated distance — specifically when

$$
|A - B| \ge s \cdot \frac{dl_x \cdot dl_y}{\sqrt{dl_x^2 + dl_y^2}}
$$

the wavefront cannot have arrived diagonally from both neighbors simultaneously. In this case we fall back to the **1D update**, simply taking the cheaper of the two axis-aligned arrivals:

$$
u_{i,j} = \min(A + dl_x,\; B + dl_y)
$$

This fallback isn't a degenerate edge case - it's the geometrically correct behavior when the propagation is effectively one-dimensional at that cell. The four-pass fast sweeping structure is otherwise unchanged.

::Folding{title="Listing - Geodesic SDF"}
```py
import numpy as np

def get_cell_spacings(lat_array):
    R = 6_371_000
    d_phi    = np.radians(np.abs(lat_array[1, 0] - lat_array[0, 0]))
    d_lambda = np.radians(np.abs(lat_array[0, 1] - lat_array[0, 0]))
    lat_rad  = np.radians(lat_array)
    return R * np.cos(lat_rad) * d_lambda, R * d_phi  # dl_x, dl_y


def solve_eikonal(A, B, s, dx, dy):
    if np.abs(A - B) >= s * (dx * dy) / np.sqrt(dx**2 + dy**2):
        return min(A + dx, B + dy)
    return (dy**2 * A + dx**2 * B + dx * dy * np.sqrt(s**2 * (dx**2 + dy**2) - (A - B)**2)) \
           / (dx**2 + dy**2)


def fast_sweep(dist, seed, dl_x, dl_y, s=1.0):
    H, W = dist.shape
    sweeps = [
        (range(H),          range(W),          -1, -1),  # ↘
        (range(H-1,-1,-1),  range(W-1,-1,-1),  +1, +1),  # ↖
        (range(H),          range(W-1,-1,-1),  -1, +1),  # ↙
        (range(H-1,-1,-1),  range(W),          +1, -1),  # ↗
    ]
    for row_range, col_range, dr, dc in sweeps:
        for r in row_range:
            for c in col_range:
                if seed[r, c]: continue
                A  = dist[r + dr, c] if 0 <= r + dr < H else np.inf
                B  = dist[r, c + dc] if 0 <= c + dc < W else np.inf
                if A == np.inf and B == np.inf: continue
                cs = s[r, c] if isinstance(s, np.ndarray) else s
                dist[r, c] = min(dist[r, c], solve_eikonal(A, B, cs, dl_x[r, c], dl_y[r, c]))
    return dist


# --- Run ---
dl_x, dl_y   = get_cell_spacings(lat_array)
seed         = (ndwi > 0)
dist         = np.where(seed, 0.0, np.inf)
dist         = fast_sweep(dist, seed, dl_x, dl_y, s=1.0)
```

The above was generated by claude. In reality we only used the euclidean version because Etosha was flat enough. Another important reason was that we had no time to manually derive all those headaching conversion metrics from spectral data to actual elevation and lat-lon coordinates.

```py
def solve_eikonal(A, B, s):
    if np.abs(A - B) >= s:
        return min(A, B) + s
    else:
        return (A + B + np.sqrt(2 * s**2 - (A - B) ** 2)) / 2


def fast_sweep(mask, seed, s=1.0):
    height, width = mask.shape

    sweeps = [
        (range(height), range(width), -1, -1),  # ↘
        (range(height - 1, -1, -1), range(width - 1, -1, -1), +1, +1),  # ↖
        (range(height), range(width - 1, -1, -1), -1, +1),  # ↙
        (range(height - 1, -1, -1), range(width), +1, -1),  # ↗
    ]

    for row_range, col_range, dr, dc in sweeps:
        for r in row_range:
            for c in col_range:
                if seed[r, c]:  # don't overwrite seed cells
                    continue
                A = getFromGrid(mask, r + dr, c)
                B = getFromGrid(mask, r, c + dc)
                candidate = solve_eikonal(A, B, s)
                mask[r, c] = min(mask[r, c], candidate)

    return mask

seed = (mask == 0)
new_mask = fast_sweep(mask.copy(), seed, s=1.0)
```
::

and this is what we got:


:Pic{src="41aa608b6f2993a2309462a88a3050bf.webp" alt="Water Proximity, Gaussian Smoothed in preprocessing NDWI (σ=5)"}

### 2x03. Indices and Probabilities

At this point the pipeline is pretty straightforward: just AHP merge everything together. First weights were listed and computed for each "event threat index" ($\vartheta_i$). Then the three event threat indices were 

| Event \ Impact | Population | Vegetation | Thirst | Wetness | Salinity |
|---|:---:|:---:|:---:|:---:|:---:|
| **Disease** | +1 | +1 | 0 | 0 | 0 |
| **Fire** | +1 | +1 | -1 | -1 | +1 |
| **Poaching** | +1 | -1 | 0 | -1 | 0 |
| **Human Interv.** | +1 | +1 | -1 | -1 | 0 |



> We actually did so much AHP we had a template for matrices from of size 1x1 to 6x6. For each variable we just order them from the most important to least and a matrix is ready for the pipeline.
> :Pic{src="07ebd06a2a9a7b7f717d191a7accbe7a.webp" alt="An AHP matrix someone told me to draw; we never actually used it"}

And this gives us something my team called the "Possibility Index", which correlates with the "danger" of a place.

> This is just too random for human to interpret so we just assumed it works.

:Pic{src="92e5b26ae3fceb76537fd0e7295559e3.webp" alt="Possiblility Index. All spectral data were preprocessed with Gaussian (σ=2)"}

It was already about 4 or 5 in the morning, and the other modeler JYZ also made notable progress on personnel allocation -- truely a milestone in progress worth celebrating. It wasn't until we checked against our plan doc that we snapped back to reality: two very serious problems were staring us in the face.


1. **<mark>What is this data's dimension?</mark>** What unit is it in? What does pointwise addition do? What about multiplication? What about its gradient? What about other matrix interpretation? What unit is it in? What does pointwise addition mean? What about multiplication, or its gradient, or any other matrix interpretation? The table assigns $+1$ and $-1$ as correlational signs, but these are *ordinal labels*, not quantities — they live in no well-defined vector space. There is no metric, no inner product, no meaningful notion of "twice as much." Treating them as scalars in any downstream arithmetic is, formally, a category error.
2. **<mark>How in the world can this data be made to encode temporal patterns?</mark>** Right now, many of the model's parameters are normalized from each sample's observed range to $[0, 1]$. This is a critical subtlety: range normalization is *per-snapshot* — the minimum and maximum are computed *within* each timeframe independently, and everything is rescaled relative to those local extremes. This effectively erases any information about the total scale of data, which makes it impossible to compare across timeframes.

<br/>

::Chat
{:3-10 04:21}

{HRX}

我说真的

我的文档

一个字没读吗

<img src="/assets/hacker-meme.webp"/>

{:HRX went for a nap}

{:3-10 07:14}

{:JYZ is online}

{JYZ}

所以现在啥情况

那个allocation能跑吗

我刚醒

{.LCX}

你那个allocation有点神秘问题

{.LCX}

暂时写了个voronoi顶上

{.LCX}

hrx让你速速请假因为缺了好多东西

{.LCX}

<img src="/assets/cat-smiling-emoji.webp"/>