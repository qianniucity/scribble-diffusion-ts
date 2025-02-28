import copy from "copy-to-clipboard";
import { Copy as CopyIcon, PlusCircle as PlusCircleIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useEffect, useRef, useState } from "react";
import Loader from "@/app/ui/loader";
import type { PredictionsEntry } from "@/app/lib/definitions";

export default function Predictions({ predictions, isProcessing, submissionCount }: {
  predictions: PredictionsEntry[],
  isProcessing: boolean,
  submissionCount: number
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (submissionCount > 0) {
      const scroll = scrollRef.current;
      if (scroll) {
        scroll.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [predictions, submissionCount]);

  if (submissionCount === 0) return;

  return (
    <section className="w-full my-10" >
      <h2 className="text-center text-3xl font-bold m-6" > Results </h2>

      {
        submissionCount > Object.keys(predictions).length && (
          <div className="pb-10 mx-auto w-full text-center" >
            <div className="pt-10" ref={scrollRef} />
            <Loader />
          </div>
        )
      }

      {
        Object.values(predictions)
          .slice()
          .reverse()
          .map((prediction, index) => (
            <Fragment key={prediction.id} >
              {index === 0 &&
                submissionCount === Object.keys(predictions).length && (
                  <div ref={scrollRef} />
                )
              }
              <Prediction prediction={prediction} />
            </Fragment>
          ))
      }
    </section>
  );
}

export function Prediction({ prediction, showLinkToNewScribble }: {
  prediction: PredictionsEntry,
  showLinkToNewScribble?: boolean
}) {
  const [linkCopied, setLinkCopied] = useState(false);

  const copyLink = () => {
    const url =
      `${window.location.origin}/scribbles/${prediction.uuid || prediction.id}`; // if the prediction is from the Replicate API it'll have `id`. If it's from the SQL database, it'll have `uuid`
    copy(url);
    setLinkCopied(true);
  };

  // Clear the "Copied!" message after 4 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      setLinkCopied(false);
    }, 4 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  if (!prediction) return null;

  return (
    <div className="mt-6 mb-12" >
      <div className="shadow-lg border my-5 p-5 bg-white flex" >
        <div className="w-1/2 aspect-square relative border" >
          <Image
            src={prediction.input.image}
            alt="input scribble"
            layout="fill"
            sizes="(min-width: 1024px) 1024px, (min-width: 768px) 768px, 100vw"
            className="w-full aspect-square"
          />
        </div>
        < div className="w-1/2 aspect-square relative" >
          {
            prediction.output?.length ? (
              <Image
                src={prediction.output[prediction.output.length - 1]}
                alt="output image"
                layout="fill"
                sizes="(min-width: 1024px) 1024px, (min-width: 768px) 768px, 100vw"
                className="w-full aspect-square"
              />
            ) : (
              <div className="grid h-full place-items-center" >
                <Loader />
              </div>
            )
          }
        </div>
      </div>
      < div className="text-center px-4 opacity-60 text-xl" >
        &ldquo; {prediction.input.prompt} &rdquo;
      </div>
      < div className="text-center py-2" >
        <button type="button" className="lil-button" onClick={copyLink} >
          <CopyIcon className="icon" />
          {linkCopied ? "Copied!" : "Copy link"}
        </button>

        {
          showLinkToNewScribble && (
            <Link href="/" >
              <button type="button" className="lil-button" onClick={copyLink} >
                <PlusCircleIcon className="icon" />
                新建涂鸦
              </button>
            </Link>
          )
        }
      </div>
    </div>
  );
}
