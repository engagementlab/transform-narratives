import Link from 'next/link';
import create from 'zustand';
import ExternalLink from '../components/ExternalLink';
import Layout from '../components/Layout';

type FormState = {
  status: string
  submitted: boolean
  setStatus: (status: string) => void
  setSubmitted: (isSet: boolean) => void
}
// Create store with Zustand
const useStore = create < FormState > (set => ({
  status: '',
  submitted: false,
  setStatus: (status: string) => set({
      status
  }),
  setSubmitted: (isSet: boolean) => set({
    submitted: isSet
  })
}));

export default function Community() {
  const status = useStore(state => state.status);
  const submitted = useStore(state => state.submitted);
  const setStatus = useStore(state => state.setStatus);
  const setSubmitted = useStore(state => state.setSubmitted);

  const SubmitEmail = async e => {

    e.preventDefault();
    setSubmitted(true);

    const email = e.target.email.value;
    const emailValid = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
    
    if(emailValid) {
      await fetch(`https://elab-initiatives-api.azurewebsites.net/api/newsletter?email=${email}`).then((response) => {
          return response;
        }).then((res) => {
          if (res.status === 400) {
            setStatus('already_subscribed');
            return;
          } 
          if (res.status === 500) {
            setStatus('error');
            return;
          }
          setStatus('success');
        }).catch((error) => {
          setStatus('error');
        });
    }
    else setSubmitted(false);

  }

  return (
    <Layout>
      <div className="container mt-14 mb-14 xl:mt-16 px-4 xl:px-8">
        <h2 className="text-2xl text-bluegreen font-extrabold">Get Involved with the <i>Transforming Narratives of Gun
            Violence</i> Initiative</h2>
        <h3 className='mt-12 text-xl text-bluegreen font-semibold'>For everyone</h3>

        <p>Join our mailing list:</p>

        {/* Newsletter signup */}
        <div id="newsletter">
          <form onSubmit={SubmitEmail}>
            <div className={`py-6 px-8 w-1/4 border-2 rounded-full transition-all ${status ? 'border-[#F4B477]' : 'border-bluegreen'
              }`}>
              {status === 'already_subscribed' &&
              <span className='text-bluegreen'>
                You are already subscribed.
              </span>
              }
              {status === 'success' &&
              <span className='text-purple'>
                Thanks for joining!
              </span>
              }
              {status === 'error' &&
              <span className='text-green-blue'>
                Sorry, there was a problem. Try again later, please.
              </span>
              }
              {!status &&
              <div className='flex w-full justify-between items-center'>
                <input type="email" placeholder="ADD YOUR EMAIL" name="EMAIL" id="email" width="800"
                  aria-label="Enter your email" minLength={5} required disabled={submitted}
                  className='w-full bg-lynx placeholder:text-bluegreen' />
                <input type="submit" value="Add your email" name="subscribe" id="mc-embedded-subscribe"
                  aria-hidden="true" className='hidden' />
                {!submitted &&
                <button type='submit'>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"
                    stroke="#026670" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
                }
              </div>
              }
            </div>
          </form>
          <div className="subscribed">
          </div>
        </div>

        <div className='mt-4'>
          <ExternalLink label='Support our Initiative' href='https://giving.emerson.edu/give-now?fid=h0ZJD8gm3R4%3d&fdesc=i%2bI0v73Km%2bQCb1p7mjPYeYE68k%2f8URMG' />
        </div>

      </div>
    </Layout>
    

  );
}