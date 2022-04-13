import { InferRenderersForComponentBlocks } from "@keystone-6/fields-document/component-blocks";
import Link from "next/link";
import { componentBlocks } from "../admin/components/component-blocks";
import Image from "./Image";
import Video from "./Video";

const BlockRenderers: InferRenderersForComponentBlocks<typeof componentBlocks> = {
  image: (props: any) => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Image id={'img-' + props.image.data.image.publicId} alt={props.image.data.altText} imgId={props.image.data.image.publicId}  />
        <p>{props.image.data.caption}</p>
      </div>
    );
  },
  video: (props: any) => {
    return <Video videoLabel={props.video.label} videoUrl={props.video.value} thumbUrl={props.video.thumb} />
  },
  button: (props: any) => {
    return ( 
      <Link href={props.link.props.node.children[0].text} passHref>
          <button 
          className='block lg:inline-block rounded-full px-9 py-7 mt-5 uppercase bg-lynx text-bluegreen border-2 border-bluegreen transition-all hover:bg-bluegreen hover:text-lynx'>
          {props.label}
          </button>
      </Link>
    );
  }
};

export default BlockRenderers;
