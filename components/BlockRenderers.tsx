import { InferRenderersForComponentBlocks } from "@keystone-6/fields-document/component-blocks";
import Link from "next/link";
import { componentBlocks } from "../admin/components/component-blocks";
import Image from "./Image";
import Video from "./Video";

type ButtonProps = {
  className?: string,
  hoverColor?: string,
  link: string,
  label: string,
  margin?: string,
};
const BlockRenderers: InferRenderersForComponentBlocks<typeof componentBlocks> = {
  image: (props: any) => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Image id={'img-' + props.image.data.image.publicId} alt={props.image.data.altText} imgId={props.image.data.image.publicId}  />
      </div>
    );
  },
  video: (props: any) => {
    return <Video key={props.video.value} videoLabel={props.video.label} videoUrl={props.video.value} thumbUrl={props.video.thumb} />
  },
  button: (props: any) => {
    return ( 
      <Link href={props.link.props.node.children[0].text} passHref>
          <button 
          className='inline-block rounded-full px-8 py-2 uppercase bg-lynx text-bluegreen border-2 border-bluegreen transition-all hover:bg-bluegreen hover:text-lynx'>
          {props.label}
          </button>
      </Link>
    );
  }
};

export default BlockRenderers;
