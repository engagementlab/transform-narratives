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

export default function GetInvolved() {
  const status = useStore(state => state.status);
  const submitted = useStore(state => state.submitted);
  const setStatus = useStore(state => state.setStatus);
  const setSubmitted = useStore(state => state.setSubmitted);

  const MailIcon =         
                <svg className="inline h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    style={{stroke: 'rgb(2, 102, 112)'}} />
                </svg>;

  const SubmitEmail = async(e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault();
    setSubmitted(true);

    const email =  (e.currentTarget[0] as HTMLInputElement).value;
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
      <div className="container mt-14 mb-14 xl:mt-16 px-4 xl:px-8 w-full xl:w-1/2">
        <h2 className="text-2xl text-bluegreen font-extrabold">Get Involved with the <i>Transforming Narratives of Gun
            Violence</i> Initiative</h2>
        <h3 className='mt-12 text-xl text-bluegreen font-semibold'>For everyone</h3>

        <p>Join our mailing list:</p>

        {/* Newsletter signup */}
        <div id="newsletter">
          <form onSubmit={SubmitEmail}>
            <div className={`py-6 px-8 w-4/5 md:w-1/2 border-2 rounded-full transition-all ${status ? 'border-[#F4B477]' : 'border-bluegreen'
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
                {!submitted ?
                <button type='submit'>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"
                    stroke="#026670" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
                :
<svg
  viewBox="0 0 24 24"
  width="24"
  height="24"
>
  <g transform="matrix(0.045376, 0, 0, 0.045376, 0, -1.218482)">
    <g>
      <path
        d="M523.859,232.329h-41.701c-5.07,0-9.715-4.073-10.59-9.067c-19.57-111.442-117-196.409-233.962-196.409
			C106.589,26.853,0,133.441,0,264.458c0,131.018,106.589,237.605,237.606,237.605c12.675,0,22.95-10.275,22.95-22.949
			s-10.275-22.949-22.95-22.949c-105.708,0-191.706-85.998-191.706-191.707c0-105.707,85.995-191.706,191.703-191.706
			c91.583,0,168.325,64.569,187.208,150.564c1.086,4.951-2.359,9.012-7.426,9.012H380.66c-5.07,0-6.578,3.182-3.371,7.108
			l69.162,84.621c3.209,3.926,8.408,3.926,11.619,0l69.162-84.621C530.439,235.511,528.928,232.329,523.859,232.329z"
        style={{fill: 'rgb(2, 102, 112)'}}
      ></path>
    </g>
  </g>
  <animateTransform
    attributeName="transform"
    type="rotate"
    dur="1s"
    repeatCount="indefinite"
    keyTimes="0;1"
    values="0 0 0;360 0 0"
  ></animateTransform>
</svg>
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

        <div className='text-bluegreen'>
          <div className='mt-4'>
            <Link href='/events'><a>Check out our latest events</a></Link>
          </div>

          <div className='mt-4'>
            <a href='mailto:engagementlab@emerson.edu&subject=Transforming Narratives of Gun Violence Initiative'>
              Get in touch {MailIcon}
            </a>
          </div>
        </div>

        <h3 className='mt-12 text-xl font-semibold text-bluegreen'>
          <Link href='https://docs.google.com/forms/d/1crW6N7JI7C3fhkGwmlKKOiSQQz7h_wI-1aHA55JPmdM'><a>For students
            {MailIcon}</a></Link>
        </h3>

        <div className='mt-4'>
          <ExternalLink label='Learn about upcoming social impact studios' href='https://elab.emerson.edu/studios' />
          <p>
            Social impact studios are interdisciplinary classes at Emerson that work alongside community partners on issue-based
            projects, like gun violence
          </p>
        </div>
        <div className='mt-4'>
          <p className='font-semibold'>Learn about the Engagement Lab co-curricular</p>
          <p>
            The ELab co-curricular is a one credit opportunity to work closely with ELab faculty on collaborative projects or
            research
          </p>
        </div>
        <ExternalLink label='Work at the Engagement Lab' href='https://elab.emerson.edu/jobs' />
        <p>
          ELab hires students every year across disciplines to contribute to the work of ELab in communications, visual design,
          videography, coding, event planning, and more.
        </p>

        <h3 className='mt-12 text-xl font-semibold text-bluegreen'>
          <Link href='https://docs.google.com/forms/d/1ZmC1CJfIquw2Ss-vWBT4auydgoGMKzlSKh13FgNtZ-M'><a>For Emerson faculty {MailIcon}</a></Link>
        </h3>

        <div className='mt-4'>
          <p className='font-semibold'>Teach a studio</p>
          <p>
            The Engagement Lab supports faculty to design and teach studios within our social impact initiatives, including coordinating with partners
          </p>
        </div>
        <div className='mt-4'>
          <p className='font-semibold'>Become an Engagement Lab fellow</p>
          <p>
        Engagement Lab fellows are ..........?
          </p>
        </div>
        <div className='mt-4'>
          <p className='font-semibold'>Teach a studio</p>
          <p>
            The Engagement Lab supports faculty to design and teach studios within our social impact initiatives, including coordinating with partners
          </p>
        </div>
        <div className='mt-4'>
          <p className='font-semibold'>Become an initiative captain</p>
          <p>
            Initiative captains are one year appointments that place faculty in a leadership role within the initiative to work with the collaborative leadership team to shape priorities, onboard partners, and make connections to Emerson faculty and students.
          </p>
        </div>
        <div className='mt-4'>
          <p className='font-semibold'>Participate in the summer workshop in collaborative pedagogy</p>
          <p>
          Each May, the Engagement Lab hosts a 3-day workshop on collaborative pedagogy, open for all Emerson faculty interested in teaching social impact studios
          </p>
        </div>

        <h3 className='mt-12 text-xl font-semibold text-bluegreen'>
          <Link href='https://docs.google.com/forms/d/19dxzJJr15RTaitx0nAFkGAq0A5CtQfIglpw03mDQDUo/'><a>Boston-area community organizations and individuals {MailIcon}</a></Link>
        </h3>

        <div className='mt-4'>
          <p className='font-semibold'>Be a guest speaker</p>
          <p>
          How has your life been impacted by gun violence? How are you working toward peace, healing, and justice? Come share your story with an Emerson class.
          </p>
        </div>
        <div className='mt-4'>
          <p className='font-semibold'>Collaborate with a studio</p>
          <p>
          We are looking for groups, organizations, or individuals with direct experience with the issue of gun violence to work alongside students and faculty over the course of a full semester. Studio collaborators help shape studio projects and are active participants in the co-creation process. Collaborators receive a certificate and honorarium for their participation.
          </p>
        </div>
        <div className='mt-4'>
          <p className='font-semibold'>Tell us what you’re up to</p>
          <p>
          We are always seeking to learn more about the work happening on the ground.
          </p>
        </div>

        </div> 
    </Layout>
    

  );
}