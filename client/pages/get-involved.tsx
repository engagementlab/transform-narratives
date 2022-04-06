import Link from 'next/link';
import Layout from '../components/Layout';

type CommunityPage = {
    values: any;
}; 

type Person = {
    name: string;
    title: string;
    remembrance: string;
    blurb: string;
    image: any;
    content: any;
}; 
export default function Community() {
  return (
    <Layout>
          <div
          className="container mt-14 mb-14 xl:mt-16 px-4 xl:px-8">
              <h2 className="text-2xl text-bluegreen font-extrabold">Get Involved with the <i>Transforming Narratives of Gun Violence</i> Initiative</h2>
              <h3 className='mt-12 text-xl text-bluegreen font-semibold'>For everyone</h3>        

              <p>Join our mailing list</p>   
              <div id="newsletter">
                <form
                action="https://engagementgamelab.us6.list-manage.com/subscribe/post?u=8cb16e3042072f11cc0680d36&amp;id=e9f56f4f4d"
                method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" className="validate"  
                target="_blank">
                <input type="email" placeholder="Your email" name="EMAIL" className="required email" id="mce-EMAIL" width="400" aria-label="Enter your email"/>
                <input type="submit" value="Subscribe to Newsletter" name="subscribe" id="mc-embedded-subscribe"
                    className="button hidden" aria-hidden="true"/>
                </form>
                <div className="subscribed">
                <span>
                    Thanks for joining!
                </span>
                </div>
                <button>
                </button>
                <div className="error">
                    You are already subscribed.
                </div>
              </div>
              <p>
                  <Link href="https://giving.emerson.edu/give-now?fid=h0ZJD8gm3R4%3d&fdesc=i%2bI0v73Km%2bQCb1p7mjPYeYE68k%2f8URMG" passHref>Support our Initiative <svg viewBox="93.105 325.421 10.581 10.581" width="10.581" height="10.581">
                    <path d="M 101.724 330.494 L 93.908 330.453 L 93.895 331.066 L 101.587 331.066 L 99.436 333.217 L 99.913 333.693 L 102.895 330.725 L 102.881 330.711 L 102.418 330.248 L 99.913 327.729 L 99.436 328.206 Z" fillRule="evenodd" transform="matrix(0.707108, -0.707106, 0.707106, 0.707108, -205.028549, 166.43837)" style="fill: rgb(2, 102, 112);"></path>
                </svg>
                </Link></p>
    </div>   
    </Layout>
    

  );
}