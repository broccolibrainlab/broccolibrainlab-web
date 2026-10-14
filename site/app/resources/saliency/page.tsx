import type { Metadata } from "next";
import Link from "next/link";
import { Arrow } from "@/components/icons";
import InPageFocus from "@/components/InPageFocus";
import SaliencyTool from "@/components/saliency/SaliencyTool";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { PAGE, SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: `Saliency map · ${SITE.name}`,
  description:
    "See which parts of an image are most likely to catch the eye first, using classic models of bottom-up visual attention. Runs in your browser.",
};

const MODELS = [
  {
    title: "Itti–Koch",
    text: "Splits the image into brightness, colour (red–green and blue–yellow) and orientation channels, compares every point with its surroundings at several scales, and combines the results, giving more weight to maps with one clear standout. It is modelled on early visual processing in primates, and is the default here.",
  },
  {
    title: "Spectral residual",
    text: "Looks at the image’s frequency spectrum and keeps the part that departs from the typical statistics of natural images. It’s fast and sensitive to shape and texture, but works on brightness only, so a colour difference counts only when it also changes brightness. It needs some surrounding detail to compare against: a single object on a plain background can be placed beside the object rather than on it.",
  },
  {
    title: "Frequency-tuned",
    text: "Measures how far each region’s colour is from the image’s average colour. It outlines whole objects that differ in colour well, but can’t see differences in orientation or texture.",
  },
];

const REFERENCES = [
  {
    text: "Itti, L., Koch, C., & Niebur, E. (1998). A model of saliency-based visual attention for rapid scene analysis. IEEE Transactions on Pattern Analysis and Machine Intelligence, 20(11), 1254–1259.",
    doi: "10.1109/34.730558",
  },
  {
    text: "Walther, D., & Koch, C. (2006). Modeling attention to salient proto-objects. Neural Networks, 19(9), 1395–1407.",
    doi: "10.1016/j.neunet.2006.10.001",
  },
  {
    text: "Hou, X., & Zhang, L. (2007). Saliency detection: A spectral residual approach. IEEE Conference on Computer Vision and Pattern Recognition.",
    doi: "10.1109/CVPR.2007.383267",
  },
  {
    text: "Achanta, R., Hemami, S., Estrada, F., & Süsstrunk, S. (2009). Frequency-tuned salient region detection. IEEE Conference on Computer Vision and Pattern Recognition.",
    doi: "10.1109/CVPR.2009.5206596",
  },
];

export default function SaliencyPage() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SiteHeader />
      <main id="main" tabIndex={-1}>
        <section className="page-intro page-intro-tool" aria-labelledby="page-title">
          <div className="container">
            <Link className="back-link" href={PAGE.resources}>
              <Arrow direction="left" />
              All resources
            </Link>
            <p className="eyebrow eyebrow-rule">Tool · Visual attention</p>
            <h1 className="page-title" id="page-title">
              Saliency map
            </h1>
            <p className="page-lede">
              Add an image to see which parts are most likely to catch the eye in the first moments of looking,
              according to classic computational models of visual attention. Or add several to compare them side by
              side.
            </p>
          </div>
        </section>

        <section className="tool-section" aria-label="Saliency tool">
          <div className="container">
            <SaliencyTool />
          </div>
        </section>

        <section className="section" aria-labelledby="how-title">
          <div className="container section-grid">
            <div>
              <p className="eyebrow">How it works</p>
              <h2 className="section-title" id="how-title">
                Models of bottom-up attention.
              </h2>
            </div>
            <div className="section-body">
              <p className="prose-lead">
                Some things grab our attention before we decide to look for them: a red apple among green ones, a
                single tilted line. A saliency map estimates how strongly each part of an image stands out from its
                surroundings in this automatic, stimulus-driven way.
              </p>

              <h3 className="minor-title how-heading">The three models</h3>
              <ol className="topics" role="list">
                {MODELS.map((model, index) => (
                  <li className="topic" key={model.title}>
                    <span className="topic-num" aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h4 className="topic-title">{model.title}</h4>
                      <p className="topic-text">{model.text}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <h3 className="minor-title how-heading">Predicted fixations</h3>
              <p className="prose">
                The numbered points show where the model expects the eyes to land first, second, and so on. The tool
                repeatedly takes the most salient point and then suppresses the area around it, so the next pick moves
                elsewhere. Itti and colleagues call this winner-take-all with inhibition of return.
              </p>

              <h3 className="minor-title how-heading">Comparing images</h3>
              <p className="prose">
                Compare mode runs the same model on up to 12 images and reports two numbers for each.{" "}
                <em>Standout</em> is how many times more salient the image’s peak is than the next-best spot elsewhere
                in it: about 1× when several spots compete, higher when one clearly wins. <em>Salient area</em> is the
                share of the image at least half as salient as its peak. With Itti–Koch on the sample set, the two displays
                with an odd item out stand out at 3.6× and 1.8×, against 1.0× for the display without one. Each map is scaled to its
                own image, so these numbers compare how attention is distributed within each image, not which image is
                more eye-catching overall.
              </p>

              <h3 className="minor-title how-heading">What it can’t tell you</h3>
              <p className="prose">
                These are bottom-up models. They know nothing about faces, text, meaning or what the viewer is trying
                to do, and all of these strongly guide where people actually look. Read the map as a description of
                low-level contrast, not as a prediction of what a particular person will look at.
              </p>

              <h3 className="minor-title how-heading">How we checked it</h3>
              <p className="prose">
                We test each model on visual-search displays with one odd item out, like the two samples above, with the
                target placed in each of 30 positions. Itti–Koch and spectral residual find the target every time in
                both displays. Frequency-tuned finds the red disc every time but, as expected for a colour-only model,
                not the tilted bar.
              </p>

              <h3 className="minor-title how-heading">References</h3>
              <ul className="references" role="list">
                {REFERENCES.map((ref) => (
                  <li key={ref.doi}>
                    {ref.text}{" "}
                    <a href={`https://doi.org/${ref.doi}`} target="_blank" rel="noopener noreferrer">
                      doi:{ref.doi}
                      <span className="visually-hidden"> (opens in a new tab)</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
      <InPageFocus />
    </>
  );
}
