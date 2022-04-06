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

const SubmitEmail = async e => {

  e.preventDefault();

  const email = e.target.email.value;
  const emailValid = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);

}

export default function Community() {
  return (
    <Layout>
          <div
          className="container mt-14 mb-14 xl:mt-16 px-4 xl:px-8">
              <h2 className="text-2xl text-bluegreen font-extrabold">Get Involved with the <i>Transforming Narratives of Gun Violence</i> Initiative</h2>
              <h3 className='mt-12 text-xl text-bluegreen font-semibold'>For everyone</h3>        

              <p>Join our mailing list</p>   
              <div id="newsletter">
                <form onSubmit={SubmitEmail}>
                <input type="email" placeholder="Your email" name="EMAIL" id="email" width="400" aria-label="Enter your email" minLength={5} required/>
                <label>
                  <input type="submit" value="Subscribe to Newsletter" name="subscribe" id="mc-embedded-subscribe"
                    className="button hidden" aria-hidden="true"/>
                  <button onClick={SubmitEmail}>

                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                  </button>
                </label>
                </form>
                <div className="subscribed">
                <span>
                    Thanks for joining!
                </span>
                </div>

                <div className="error">
                    You are already subscribed.
                </div>
              </div>
                <Link href="https://giving.emerson.edu/give-now?fid=h0ZJD8gm3R4%3d&fdesc=i%2bI0v73Km%2bQCb1p7mjPYeYE68k%2f8URMG" passHref>
                <span className='text-bluegreen'>
                  Support our Initiative
                  <svg viewBox="93.105 325.421 10.581 10.581" width="10.581" height="10.581" className='inline'>
                    <path
                      d="M 101.724 330.494 L 93.908 330.453 L 93.895 331.066 L 101.587 331.066 L 99.436 333.217 L 99.913 333.693 L 102.895 330.725 L 102.881 330.711 L 102.418 330.248 L 99.913 327.729 L 99.436 328.206 Z"
                      fillRule="evenodd"
                      transform="matrix(0.707108, -0.707106, 0.707106, 0.707108, -205.028549, 166.43837)"
                      style={{"fill": "rgb(2, 102, 112)"}}></path>
                  </svg>
                </span>
                </Link>
    </div>   
    </Layout>
    

  );
}