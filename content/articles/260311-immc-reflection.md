---
title: Eyes Over Etosha - A Modeling Marathon
description: Reflection on the recent IMMC international round
createTime: 2026-03-11
updateTime: 2026-03-11
---

::QuoteBox{source="Richard Hamming"}
The purpose of computing is insight, not numbers.
::

::MusicPlayer
---
mode: "server"
server: "netease"
id: "501468000"
---
::

Our fantastic team just finished IMMC26 International Round; as the lead coder I was in charge of some pretty interesting simulations and visualizations.

> This is not a technical blog, but rather a general reflection and personal account of our journey. There are hardcore sections; whenever I'm going to dive into mathmematical details I'm going to display a warning for those not interested.
>
> All used notation and variables are listed in the [appendix](#appendix).
>
> All team members will be refered to with psuedonyms for privacy.

:Pic{src="Screenshot 2026-03-11 at 18.19.39.webp" alt="2125 lines of python in 50 hours"}

We collected quite a lot of interesting artifacts, for example among them are 3GB of Sentinel Satellite data from all across africa and all 200k+ existing occurence entries of the African Elephant from GBIF.

:Pic{src="Screenshot 2026-03-11 at 18.22.17.webp" alt="Sneak peak at our paper"}
:Pic{src="6133539aa13b0c2ef181af28c8ec4b66.webp" alt="Our favourite vis"}

But most importantly, we had a great time! In this post, I'll walk through some of our most interesting work, and share an honest reflection on what it was like to live through the exhausting, thrilling, and ultimately unforgettable 100 hours.

:Pic{src="Screenshot 2026-03-11 at 18.35.21.webp" alt="International Masochastic Modeling Competition™ - Pushing your vitals to the limit"}


## 0x00. Remote Sensing, SDFs and SentinelHub
Originally, when we first saw the problem, our instinct was to discretize the  map into whatever data structure felt most natural. After some probing, this turned out to be completely infeasible -- the discrete nodes would essentially have to sit at the lattice intersections of every covariate we were analyzing, and the resulting data volume would be enormous. We were stuck.

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

> At the time I was very unfamiliar with numpy and tensors -- it took me five minutes just to work out the indexing logic for stripping the alpha channel. During the national round I had used R for all data processing, so the transition from relational algebra to tensor arithmetic was a genuine headache.

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

> My high school offers a discrete mathematics course, and given its high correlation with modeling, it's no surprise that most competition participants have taken it. What is perhaps more surprising is that at least half the class plays Riichi Mahjong -- earning the course its unofficial title: the "underground casino". The professor, for the record, is the best player in the class. I am one of the very few students not in the casino, but all of my teammates are, and are pretty decent players.
>
> Now, the SIR model tells us that the speed of infection is proportional to the number of infected individuals. And so, one night, one of my teammates decided to induct me into the casino - starting me off against a very weak computer opponent. This gave me some wholly unwarranted self-confidence, which promptly evaporated in my first human matchup. I never touched the casino again for the rest of the competition. That teammate probably just wanted to boost my productivity.
>
> He actually got a Junsei Chuuren Poutou and a double yakuman later on and almost literally flied off the table.

## 2x00. Signed Distance Fields, Water Proximity, and Elephants
::Hintbox
For those of you not familiar with remote sensing, I would recommend checking out [my blog post](/articles/260311-introductory-remote-sensing) on introductory remote sensing. Or else you'll have an headache reading the following section.
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
Intuitively, $\nabla u$ is the gradient vector of the distance field -- it points in the direction of steepest increase in distance, i.e., directly away from the nearest boundary point. The parameter $s$ represents the **local slowness** (the reciprocal of speed) of the distance propagation. While a standard Euclidean distance assumes $s = 1$, where walking one step in the gradient direction increases your distance-to-water by exactly one step, keeping $s$ as a variable allows for significant extensibility. In this context, $s$ acts as a **cost weight** or a "refractive index" for the terrain. A higher value of $s$ effectively "stretches" the accumulated distance $u$ relative to the physical space traveled, allowing us to model regions where movement is more taxing - such as thick vegetation, mud, or steep slopes -- without altering the underlying geometry.
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

Where $A = u_{i - dx, j}, B = u_{i, j - dy}$."

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

However, this 2D update is only valid when the discriminant is non-negative. When the two upwind neighbors $A$ and $B$ are too far apart in accumulated distance -- specifically when

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

1. <mark>**What is this data's dimension?**</mark> What unit is it in? What does pointwise addition mean? What about multiplication, or its gradient, or any other matrix interpretation? The table assigns $+1$ and $-1$ as correlational signs, but these are *ordinal labels*, not quantities -- they live in no well-defined vector space. There is no metric, no inner product, no meaningful notion of "twice as much." Treating them as scalars in any downstream arithmetic is, formally, a category error.
2. <mark>**How in the world can this data be made to encode temporal patterns?**</mark> Right now, many of the model's parameters are normalized from each sample's observed range to $[0, 1]$. This is a critical subtlety: range normalization is *per-snapshot* -- the minimum and maximum are computed *within* each timeframe independently, and everything is rescaled relative to those local extremes. This effectively erases any information about the total scale of data, which makes it impossible to compare across timeframes.

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

::


I thought about this for another two or three hours and came up with an elegant solution.

::WarningBox
More heavy mathematics ahead. If you are having a headache, move on to [the next section](#_3x00-composition-and-the-24h-countdown).
::

> Let $\tilde{f}$ denote the min-max normalization of $f$ (range 
normalization). That is, $\tilde{f} = \frac{f - f_{\min}}{f_{\max} - f_{\min}}$

Any scalar field preserves relative ordering under monotone transformation -- and this single observation resolves both problems at once.

**On dimension and arithmetic** -- raw indices like $\rho_V$ or $\zeta$ carry no well-defined unit; the $+1$ and $-1$ correlational signs in the event table are ordinal labels, not quantities, and treating them as scalars in downstream arithmetic is formally a category error. But after min-max normalization, $\tilde{f} \in [0, 1]$ is dimensionless by construction and lives in a well-defined probability space. Pointwise multiplication of two such fields is exactly the joint probability of two independent events -- a perfectly meaningful operation.

**On temporal comparability** -- range normalization is per-snapshot: the minimum and maximum are computed within each timeframe independently, which erases absolute amplitude. But this is a feature, not a bug. $\tilde{\zeta}(p)$ no longer asks "how threatened is $p$?" -- it asks "how threatened is $p$ *relative to the rest of the park right now*?" This relative ordering is stable and meaningful across seasons, even as the absolute scale of threat shifts with environmental conditions.

Both resolutions hinge on the same underlying assumption: that a normalized scalar field can be faithfully interpreted as a pointwise probability. We state this explicitly:

:Pic{src="Screenshot 2026-03-13 at 18.11.29.webp" alt="Assumption of Indices as Probability"}

> We abuse notation and write $P(f) := \tilde{f}$, interpreting $\tilde{f}(p)$ as the probability of the event associated with $f$ occurring at $p$.

This immediately changes everything. Probability theory is a well-studied and well-interpreted subject -- and now that our fields live in it, both problems dissolve and progress could be made once again.

> We abuse notation and write $P(f) := \tilde{f}$, interpreting $\tilde{f}(p)$ as the probability of the event associated with $f$ occurring at $p$.

First, we clarified what a personnel allocation plan is: a fracture of the park $\Omega$ into simply connected submanifolds, with each submanifold $S_i$ representing a contiguous patrol region. Let $N$ denote the total number of rangers deployed. Each patrol region has a geometric centroid $o_i$ (denoted $p_i$ in the paper -- we forgot to explicitly state that, oh no), which we take as the ranger's base of operations. Due to the lack of literature and the dwindling clock, we decided to naively model the coverage of ranger $i$ as a Gaussian field centered on $o_i$, denoted $C_i$:

$$
    C_i(p) = e^{-\lambda |p - o_i|}, \quad i = 1, \dots, N
$$

Now here is the elegant part: the probability interpretation comes in. Coverage of a point, we argued, proxies for the probability that a ranger can respond to a threat event at that point within operationally meaningful time. For example, a ranger based at the Okaukuejo waterhole could be dispatched to assist with a poaching case at Okondeka immediately upon report; they could likely reach events deeper in the salt pan with some delay -- but any meaningful assistance with a wildfire in the western woods is operationally out of reach.

Any hazardous event can in principle draw a response from any ranger. Therefore, the total coverage of the park is the aggregation of $\{C_i\}_{i=1}^{N}$ under union probability. Since responses from distinct rangers are mutually independent events:

$$
C(p) = P\!\left(\bigvee_{i=1}^{N} C_i(p)\right) = 1 - \prod_{i=1}^{N} (1 - C_i(p))
$$


Now that we have $P(C)$, $P(\zeta)$ and the assumption that response and events are independent, we can calculate $P(\neg(\zeta \to C)) = 1 - P(C \mid \zeta)$,  which corresponds to the **residual risk** at each point -- the probability that a threat occurs and goes unresponded to. We call this the **Consolidated Hazard Index**:

$$
\begin{align*}
H(p) &= P(\lnot(\zeta \to C)) = P(\zeta \land \lnot C) \\
&\overset{\perp}{=} P(\zeta) \cdot (1 - C(p))  \\
&\propto \zeta(p) \cdot (1 - C(p))
\end{align*}
$$

At last, we aggregate $H$ over $\Omega$ and normalize to provide an expected probability of a threat event that goes unresponded to.

$$
\bar H = \frac{1}{|\Omega|} \iint_{\Omega} H \, \mathrm{d}A
$$

Our pipeline was built in parallel with theoretical derivation -- a series of Jupyter notebooks caching intermediate results into `.npy` dumps, which in retrospect was not the cleanest approach. By the end, the notebooks were thoroughly littered with diagnostic `imshow`s, on-demand `import`s, and one-off transformations that only existed to sanity-check a specific metric at 3am. A proper pipeline with clearly separated preprocessing, feature engineering, and evaluation stages would have saved us considerable pain -- something to fix next time.

> Another headache we had was that after updating a utility method, the whole notebook has to be reloaded to re-import the method.

The cost of running the full pipeline on a new date was high enough that we were very selective. Declouding alone was a manual process -- we never set up a pipeline for fetching the `SCL` scene classification channel, so cloud contamination had to be assessed by eye. Clouds outside the park boundary are harmless, but those sitting over the region of interest corrupt the spectral indices entirely. Automating a cloud density threshold would have been its own rabbit hole, so we simply picked dates we could visually confirm were clean. Since spectral indices are fairly stable within each season in Etosha anyway, two sample dates felt sufficient: 2022-01-24 (rainy season) and 2022-08-24 (dry season).

> A main reason, frankly, was that the NDRE and NDWI simply looked the best on these two dates graphed out in contours.

Our final model achieved $\bar{H} = 9.5\%$ -- meaning on average, roughly 1 in 10 threat events goes unresponded to. To put this in context: the global average staffing for protected areas is approximately one ranger per $72 \mathrm{km}^2$, and Etosha spans over $22{,}000\ \mathrm{km}^2$ -- meaning the baseline situation is already severely stretched. Against that backdrop, $9.5\%$ with only 100 simultaneous patrol staff felt like a satisfying result.

:Pic{src="69a79c72-0854-472f-9baa-fb9badeaa6b1.webp" alt="Optimal coverage for N=100"}
:Pic{src="dad60d01-3cf8-4969-91d9-515cb002215c.webp" alt="Optimal H for N=100"}

> All visualizations above correspond to the optimal partition produced by the final pipeline, discussed in depth in [the next subsection](#_2x04-binary-search-and-allocation).
>
> Note that optimal coverage is not the same as maximum coverage across $\Omega$. Intuitively, this makes sense: coverage should be concentrated in regions of high $\zeta$, reflecting the principle that human resources ought to be allocated where the threat is greatest.
> It is very unlikely that we'll every do L<sup>1</sup> normalization on $H$ because it is meaningless to consider $H$ as a distribution; threat events does not pick a place to happen on random. So in the paper we use $\bar H$ to refer to the expectance of $\tilde H$ over $\Omega$.

$\bar{H}$ serves as a natural and interpretable penalty for assessing allocation plans — which made it a principled basis for the iterative relaxation model we develop in the next section, where I also conduct ablation tests on the additional heuristics.

### 2x04. Binary Search and Allocation

But I'm getting ahead of myself - rewind to 6pm, twelve hours earlier. I worked through the night before and accidentally fall asleep for 7 hours straight, so when I got up the team was already ready for the evening meetup.

JYZ proposed a work of his: by filling the bounding box of the park geometry with boxes and doing binary search to optimize their side length, a crude partition is made. Basically, he initialized a box size $n$ to be half the length of the shorter side of the bounding box. Then, he slices the bounding box into boxes of that size, and merges boxes together according to a stack of sophisticated heuristics. After that, we count how much of the area the boxes take up of the park, and use that as a order to do binary search on $n$.

::Folding{title="Listing - Minimal implementation"}
His original script was more of an engineered monolith; here's the core logic stripped out
```py
import numpy as np

def allocate(mask, zeta, m, N, alpha):
    rows, cols = mask.shape
    Phi = zeta[mask].sum()
    theta = alpha * Phi / N

    # partition into m x m cells
    cells = []
    for r in range(0, rows, m):
        for c in range(0, cols, m):
            patch_mask = mask[r:r+m, c:c+m]
            patch_zeta = zeta[r:r+m, c:c+m]
            eta = patch_mask.sum() / patch_mask.size
            tau = patch_zeta[patch_mask].sum()
            cells.append({ 'r': r, 'c': c, 'eta': eta, 'tau': tau })

    active = [g for g in cells if not (g['eta'] < 0.5 and g['tau'] < theta / 2)]

    # greedy row merge
    zones = []
    row_starts = sorted(set(g['r'] for g in active))
    for r in row_starts:
        row = sorted([g for g in active if g['r'] == r], key=lambda g: g['c'])
        acc, zone = 0, []
        for g in row:
            if acc + g['tau'] <= theta:
                zone.append(g); acc += g['tau']
            else:
                if zone: zones.append(zone)
                zone, acc = [g], g['tau']
        if zone: zones.append(zone)

    return zones

def binsearch(mask, zeta, N, alpha=1.5):
    rows = mask.shape[0]
    lo, hi, best = 1, rows, None
    while lo <= hi:
        m = (lo + hi) // 2
        zones = allocate(mask, zeta, m, N, alpha)
        if len(zones) <= N:
            best = zones; lo = m + 1
        else:
            hi = m - 1
    return best
```

Example Usage:
```py
mask = np.load('etosha-mask.npy').astype(bool)
zeta = np.load('pti.npy')
zones = binsearch(mask, zeta, N=100)
print(f'Got {len(zones)} zones')
```
::

This is genuinely a good idea, if it wasn't for the fact that this approach is not working at all.

:Pic{src="26504ac81e32bfdb839d4875d3fb70cc.webp" alt="BinSearch fracturing, N=5"}

I proposed using Lloyd relaxation on a randomly scattered set of seeds with voronoi partitions. This intuitively was the most straightforward approach, but out of pure *collaboration spirit*, a trust for the legitimacy of a USACO platinum, and the effort JYZ put into it, I decided to give this approach a shot. And after hours of toil nothing worked, but we find an interesting subtlety in one of the variations:

::Chat
{:3-9 12:17}

{.LCX}

这是两百个点的

{.LCX}

我也跑一个100的试一下

{.LCX}

<img src="/assets/260311-immc-reflection/79e0b8d19f6325a03ab08c4693cab747.webp">

{.LCX}

<img src="/assets/260311-immc-reflection/3d3ac1c900eb0686ddfed7c1e2ba3574.webp">

{.LCX}

斯这个没啥差别反而你的好一个百分点

::

In a certain weighted divide-and-conquer variation, the overall $\bar{H}$ actually surpasses the traditional Voronoi approach. Since Voronoi tessellation is already geometrically optimal in the unweighted sense, any improvement cannot come from superior geometry alone -- it can only come from the seed placement. From everything we read, weighted CVT literature always applies the density weighting during iteration — nobody had thought to bake it into the initialization. As far as we can tell, this is the <mark>**first deterministic seeding strategy**</mark> that uses a scalar weight field to distribute zones before Lloyd ever runs -- and the $\bar{H}$ numbers suggest it genuinely matters. At the time it was developed proposed, not much attention was given and we didn't even give it a proper name:

:Pic{src="Screenshot 2026-04-07 at 00.32.45.webp" alt="P15 on our seeding algorithm"}

Looking back it was really a feat.

> Our algorithm was actually meant for convex geometry. When applying to actual geometry like the park, points get mapped outside the geomtry. We project each point outside the geometry along the normal field of $\Omega$ onto and slightly into the park, and apply a subtle wiggle:

Now we have a good initial seed set -- but that only means we're starting from a favorable position. The actual optimization is still missing. This class of iterative geometric optimization problems has been studied for decades under the general name of **relaxations**.

::Defbox{id="Relaxation"}
A **relaxation** is an iterative procedure that monotonically reduces some energy functional toward a local minimum. Each iteration moves the current configuration to a strictly better one, until convergence.
::

The name is apt: rather than solving the optimization directly -- which is intractable for our product-form $\bar{H}$ — we repeatedly *relax* the configuration toward a better state, one iteration at a time. The specific energy we reduce is the quantization energy $E$, which we showed serves as a tractable surrogate for $\bar{H}$.

::NoteBox
Well $\bar{H}$ is not *exactly* monotonic with $E = \sum_{i=1}^{N} \iint_{V_i} \zeta(x) \|x - p_i\|^2 \, dA$. However we can provide a justification of surrogatability of $\bar H$ for $E$.

$$
\begin{align}
    H &= \frac{1}{|\Omega|} \iint_\Omega \zeta (x) (1 - C(x)) \, \mathrm d A \\
    &= \frac{1}{|\Omega|} \iint_\Omega \zeta (x) \prod_i \left(1 - e^{-\lambda \|x - p_i\|}\right) \mathrm d A \\
    &= \frac{\lambda^N}{|\Omega|} \iint_\Omega \zeta (x) \prod_i \|x - p_i\| \, \mathrm d A \\
    &\gtrsim \frac{\lambda^N}{|\Omega|} \sum_i \iint_{V_i} \zeta(x) \|x - p_i\|^2 \, \mathrm d A = \frac{\lambda^N E}{|\Omega|} \propto \boxed{E}
\end{align}
$$

In $(2)$ we use a first-order Taylor approximation of each gaussian field at $p_i$. We argue that $(3)$ is pragmatically justified, but thats more of a safe assumption.
::

There are multiple existing algorithms for relaxation of $E$: among them the most widely employed is the **Lloyd Relaxation**. Basically for each partition $S$ it calculates it's "center of mass" ($\iint_S f p\, \mathrm{d}A$) and moves the centroid there:

:Pic{src="voronoi-relax.gif" alt="10 Epochs of Lloyd Relaxation with boudary avoidance"}

Lloyd was a nice algorithm and has been shown to make $E$ converge with each epoch. The problem is, this does not account for terrain, which may lead to undesired allocation plans. We introduced two heuristics.

1. $\alpha$ controls **terrain repulsion** -- each seed is pushed away from $\partial\Omega \cup \Omega_T$ ($\Omega_T$ is a fuzzy geometry of terrains) by a force inversely proportional to squared distance, keeping patrol bases away from boundary features and impassable terrain. 
$$
\mathbf{f}_{\text{terrain}}^{(i)} = \sum_{q \in \partial\Omega \cup \Omega_T,\, \|p_i - q\| < R} \frac{p_i - q}{\|p_i - q\|^2}
$$


2. $\beta$ controls **neighbor repulsion** -- each seed is pushed away from all other seeds by a force inversely proportional to squared distance, compensating for clustering caused by terrain repulssion. This prevents zone collapse and maintains spatial coverage that the Lloyd centroid attraction alone does not guarantee.

$$
\mathbf{f}_{\text{neighbor}}^{(i)} = \sum_{j \neq i} \frac{p_i - p_j}{\|p_i - p_j\|^2}
$$

3. $\gamma$ controls the classical **Lloyd attraction**.

$$
\mathbf{f}_{\text{lloyd}}^{(i)} = \frac{\iint_{V_i} \zeta(x)\, x\, dA}{\iint_{V_i} \zeta(x)\, dA} - p_i
$$

At each epoch, the three forces are composed additively:

$$
p_i \leftarrow p_i + \alpha\, \mathbf{f}_{\text{terrain}}^{(i)} 
+ \beta\, \mathbf{f}_{\text{neighbor}}^{(i)} 
+ \gamma\, \mathbf{f}_{\text{lloyd}}^{(i)}
$$
followed by a snap-back projection $p_i \leftarrow \arg\min_{q \in \Omega} \|p_i - q\|$ 
to keep seeds within $\Omega$.

Ablation studies on those heuristics showed that $\alpha$ generally tend to reduce overall coverage quality. This is a necessary tradeoff, considering that hazards might also be somehow correlated to terrain. An interesting extension would be to decompose $\mathbf{f}_{\text{terrain}}$ into separate repulsion and attraction terms over two disjoint fuzzy submanifolds of $\Omega$ -- repelling from impassable areas while attracting toward high-threat accessible terrain.

Combining all of our work together, the final partition yields a $\bar H$ of about $9\%$, a considerable improvement from naïve random seeding + lloyd relaxation. For me this is one of the best results we get in this project.

## 3x00. Composition and the Final Sprint

Submission day was March 9th -- a school day. HRX and I had both taken the day off, but JYZ and LTA hadn't. When they got home at four in the afternoon, we had four hours left before the submission window closed. It was at this moment we realized three of our seven tasks hadn't been started at all. 

Long story short -- we got it done on time but it was sorta rough...?

:Pic{src="Screenshot 2026-04-11 at 22.04.31.webp" alt="90 Million dollars."}
:Pic{src="Screenshot 2026-04-11 at 22.06.17.webp" alt="Rich Countries Hmmm"}

Im not in charge of budgets so I wont extend on this. 

My teammates chose Abisko National Park (Sweden) and the National Park of American Samoa — and honestly, as contrasting test cases go, they couldn't have picked better ones. The only problem was that by the time both selections were confirmed, I had half an hour to fetch all the data and write the conclusion. So I ended up piling whatever I could think of into a giant paragraph of academic jargon that somehow actually looks like something.

:Pic{src="Screenshot 2026-04-11 at 22.06.49.webp" alt="Stream of consciousness is a widely employed narrative device in modernism and postmodernism literature."}

Whats even worse is that Sentinel did not capture a single image of Samoa. I meant, never, even, *once*.

:Pic{src="Screenshot 2026-04-11 at 22.10.58.webp" alt="Well what could I do? Im the satellites guy."}

The last hour was pretty messy, just everyone scrambling to get the paper done. Our writer LTA gets exceptionally busy.

::Chat
{:3-9 18:37}

{HRX}

ok

写letter

立刻马上

我去写summary page

@LTA

letter只需要包含etosha park的结果

{LTA}

豪德

{HRX}

也就是不包含model application部分的内容

然后他要求降低技术性

问李哥要随便一个巡逻队的风区图

不要和之前重复的

@LCX @LTA

{.LCX}

彳亍

{LTA}

ok
::

And she actually did whips out a fantastic letter at 19:30, completing the last task.

::Folding{title="Open for the Letter"}

Date: March 2026 <br>
To: The International Mathematical Modeling Challenge Committee<br>
From: Team IMMC26678622<br>
Subject: A Scalable Data-Driven Framework for Conservation Resource Allocation in Protected Areas<br>

Dear Members of the IMMC Committee,

&emsp; We are deeply honored to have been entrusted with developing a mathematical model to address the urgent conservation challenges facing Namibia’s Etosha National Park, one of Africa’s most ecologically significant protected areas, and to design a scalable resource allocation solution for imperiled natural reserves across the globe. We present a rigorous, adaptable mathematical framework for optimized conservation resource allocation, developed to address the acute, multifaceted threats to Namibia’s Etosha National Park and scalable to protected areas worldwide. Plagued by poaching, human encroachment, wildfires, and wildlife disease, Etosha operates with a critically understaffed workforce and limited targeted technological infrastructure. Our work delivers a robust model that quantifies threat risk, optimizes deployment of existing and supplementary resources, and provides actionable guidance for biodiversity conservation decision-makers. Below is a succinct synthesis of our methodology, core insights, and pragmatic recommendations.

&emsp;Anchored in the principle that conservation resources must align with measurable, spatially explicit threat risk, our four-stage modular process utilizes accessible remote sensing and wildlife data with minimal technical barriers. We categorize four key mitigable threats, quantify their severity via a validated Event Threat Index, map fine-scale park risk through a Point Threat Index integrating satellite and machine learning-derived data, and consolidate findings into a holistic Possibility Index heatmap paired with an Adaptive Grid Partition algorithm to strategically allocate rangers and technology to high-risk hotspots within operational constraints.

&emsp;Our analysis yields three pivotal, globally transferable insights: uniform patrol zoning is inherently inefficient, with existing Etosha ranger reallocation alone reducing unaddressed threats by significant percentage without extra staffing; threat risk stems from interconnected environmental variables, and ignoring these correlations undermines conservation efficacy; human-technological synergy between rangers and low-cost tools such as monitoring cameras and solar-powered fixed-wing UAVs maximizes surveillance coverage and cost-effectiveness.

&emsp;We propose immediate, evidence-based recommendations for Etosha, split into zero-cost workforce reallocation and targeted high-impact technological investment. Adaptive, risk-based patrol zoning and flexible response protocols will achieve full threat coverage. Deploying solar monitoring cameras, solar UAVs for remote patrols, and a centralized data hub will eliminate surveillance gaps and streamline real-time threat response.

&emsp;A core strength of this framework is its universal adaptability, validated across ecologically distinct protected areas including Sweden’s Abisko National Park and the National Park of American Samoa. Only minor context-specific adjustments, such as local threats, regional environmental data, and site-specific resource limits, are required for implementation, with no core structural changes, establishing this as a versatile global conservation tool. Key results of these cross-park applications are as follows:

&emsp;Abisko National Park (Sweden): Located within the Arctic Circle, this park features cold, mountainous terrain with unique naturogenic threats (avalanches, snowstorms) that replace Etosha's wildfire and disease as primary natural risks. We retained the model’s anthropogenic threat categorization (poaching and human intervention remain relevant), Event Threat Index criteria and weights, and environmental covariates (all spectral and engineered indices are generable via satellite remote sensing for this region), with two critical adjustments. We redefined the naturogenic threat set to reflect Arctic-specific hazards, and recalculating Point Threat Index weights via AHP to capture the unique relationships between Abisko's environmental covariates (e.g., high thirstiness index, low plant density) and its new threat set. Given Abisko's small spatial extent, our optimized resource plan prioritizes fixed monitoring cameras (over UAVs, which are inefficient for compact areas) and a smaller patrol force (25 on-duty rangers) due to the park’s lower overall threat density and more accessible terrain.

&emsp;National Park of American Samoa: Situated near the equator, this tropical park features rainforest terrain, high humidity, and unique naturogenic threats (floods, rainstorms) driven by extreme rainfall. As with Abisko, we retained the model’s core components (anthropogenic threats, Event Threat Index, environmental covariates) and adjusted only the naturogenic threat set and Point Threat Index weights to reflect tropical rainforest dynamics. For example, wetness and salinity covariates have amplified impacts on flood and rainstorm risk, and animal density is concentrated in low-elevation areas near water sources. The park’s small spatial extent (similar to Abisko) led us to prioritize fixed cameras over UAVs in the technological resource plan, with an optimal patrol force of 22 on-duty rangers and a dedicated flood response team (integrated into the redundancy staff).

&emsp;For both Abisko and the National Park of American Samoa, located in economically developed nations, our model also accounts for higher budget availability, recommending full technological deployment (cameras, terrain-specific monitoring equipment) to achieve near-perfect threat coverage, a flexible design choice that allows the model to align with varying national budget constraints.

&emsp;In conclusion, this framework proves targeted resource optimization drives effective conservation, with strategic reallocation of existing assets delivering tangible risk reduction for Etosha, and supplementary investments enabling comprehensive long-term protection. Beyond Namibia, this modular model provides a rigorous, practical blueprint for evidence-based protected area governance worldwide. We stand ready to collaborate with the IMMC, relevant authorities, and global conservation stakeholders to deploy and refine this framework across international protected landscapes.

&emsp;Grateful for the opportunity to contribute to this critical global challenge, we remain at your disposal for further discussion.

<p style="text-align: right;">
Sincerely, <br/>
Team IMMC26678622
</p>

::

We were the last group to submit, just stepping on the verge of elimination at 19:59. 

But whatsoever, we've done it. After over 100 hours of hardship and toil, we finally made it to the end. No matter the result, this will be a very this will be a very memorable chapter in my three years of high school life.

## 4x00. Afterword
We always joke that each COMAP round is really just an elaborate way to learn a subject we never signed up for. Pathfinding robotics (HIMCM25), lattice theory (IMMC26 National Round), and now remote sensing (IMMC26 International Round) -- none of us came in knowing any of it. But more than the academics, these two rounds left something harder to quantify: a clearer sense of how to work, and who to work with.

On the individual level we had a pretty well-matched team. We never had a team leader, but HRX did most of the planning and architectural work; the kind of things a team lead does. JYZ was a USACO Platinum so he was the other core modeler alongside me; I handled most of the implementation and visualization. LTA was our head writer — solid across the sciences, but her English is genuinely on another level compared to the rest of us.

The problem is, our team lacks coordination. This led to very terrible scheduling: everyone is working out of sync with each other. At first this looks reasonable; we work in shifts and we relay our progress to maximize temporal usage. However this is in fact very inefficient. The major reason the seeding algorithm took 4 hours to develop was mainly due to the fact that I did not have the opportunity to ask JYZ about crucial details for his algorithm.

But nevertheless it was a fun and important experience. I learned a lot; both in engineering, mathematical modeling, and the overall methodology for collarboative projects. Sadly our expedition to the finals stopped here, but we are all pretty satisfactory with our results. 

I'd like to thank all my fellow modelers for this extraordinary adventure — HRX for holding the architecture together when everything else was falling apart, JYZ for the binary search idea that, even in failure, led us somewhere better, and LTA for producing a letter in under an hour that the rest of us couldn't have written in a week.

If I had to distill a hundred hours of sleep deprivation and geodesic eikonal solvers into a single lesson, it would be this: the best modeling isn't the most elegant — it's the kind that actually gets submitted. 
None of it went to plan. The seeding algorithm was an afterthought. The conclusion was written in fifteen minutes. Samoa had no satellite coverage whatsoever. 

And yet, in the way that only sleep-deprived high schoolers under an arbitrary deadline can manage, it came together. IMMC has a strange way of forcing you to become competent at things you never signed up for -- and to trust people you've never quite synced schedules with. Whether or not the judges agree with our 9.5%, we built something real, and I think that's worth more than whatever score comes back.

## Appendix

Here's a table of all notations used so far:

| Symbol | Description |
|--------|-------------|
| $\rho_W$ | NDWI -- Normalized Difference Water Index |
| $\rho_V$ | NDRE -- Normalized Difference Red Edge (vegetation health) |
| $\rho_S$ | NDSI -- Normalized Difference Salinity Index |
| $\vartheta_i$ | Event Threat Index for event $i$ |
| $u(p)$ | SDF value at point $p$ -- geodesic distance to nearest waterbody boundary |
| $\partial \Omega$ | Boundary of the waterbody geometry |
| $g^{ij}$ | Inverse metric tensor (non-Euclidean Eikonal) |
| $g_{ij}$ | Metric tensor (diagonal under independence assumption) |
| $g_{\lambda\lambda}, g_{\phi\phi}$ | Diagonal entries of metric tensor in lat/lon coordinates |
| $g_{\phi\lambda}, g_{\lambda\phi}$ | Off-diagonal entries, assumed zero |
| $s$ | Local slowness -- cost weight / refractive index of terrain |
| $dl_x, dl_y$ | Arc-length steps in $x$ and $y$ directions |
| $A, B$ | Upwind neighbor values in Eikonal solver |
| $\tilde{f}$ | Min-max normalization of field $f$ |
| $\hat{f}$ | L$^1$-normalization of field $f$ |
| $\Omega$ | Park domain |
| $\zeta$ | Possibility Index (Point Threat Index) |
| $S_i$ | Simply connected submanifold (a contiguous patrol zone) |
| $o_i$ | Geometric centroid of patrol zone $S_i$ |
| $C_i$ | Coverage field for ranger $i$ |
| $C$ | Aggregated coverage field over $\Omega$ |
| $H$ | Consolidated Hazard Index |
| $\bar{H}$ | Expected Hazard -- $\frac{1}{\vert\Omega\vert} \iint_\Omega H\,dA$ |
| $N$ | Total number of rangers deployed |
| $\Phi$ | Total integrated threat -- $\iint_\Omega \zeta\,dA$ |
| $\theta$ | Per-staff threat budget -- $\alpha \cdot \Phi / N$ |
| $\alpha$ | Threat scaling factor |
| $\eta_{ij}$ | Park coverage ratio of grid cell $G_{ij}$ |
| $\tau_{ij}$ | Integrated threat of grid cell $G_{ij}$ |
| $\mathcal{G}$ | Set of active (non-absorbed) grid cells |
| $\mathcal{A}$ | Set of low-threat absorbed grid cells |
| $G_{ij}$ | Grid cell at row $i$, column $j$ |