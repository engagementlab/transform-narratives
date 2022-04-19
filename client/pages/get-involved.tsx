import Link from 'next/link';
import create from 'zustand';
import ExternalLink from '../components/ExternalLink';
import Image from '../components/Image';
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
      {/* <Image id='community-img' imgId='tngvi/get-involved/backdrop' className="xl:w-1/4 right-1/3 -bottom-full absolute" /> */}

      <div className="container relative mt-14 mb-24 xl:mt-16 px-4 xl:px-8 w-full lg:w-7/12 z-10">
        <h2 className="text-2xl text-bluegreen font-semibold mb-8">Get Involved</h2>

        <div>
          If you would like to get involved with the <i>Transforming Narratives of Gun Violence</i> Initiative,&nbsp;
          <a href='mailto:engagementlab@emerson.edu&subject=Transforming Narratives of Gun Violence Initiative'>
            please get in touch! {MailIcon}
          </a>
        </div>

        <div className="mb-14 w-full xl:flex">
          <div className="mt-14 xl:mt-16 w-full">
            <Image id='community-img' alt='A drawing of two people in front of colorful circles' imgId='tngvi/get-involved/public' className="xl:w-3/5 mx-auto" />

            <h3 className='mt-8 text-xl text-bluegreen font-semibold'>General Public</h3>

            <p>Stay up-to-date on the latest by joining our mailing list</p>

            {/* Newsletter signup */}
            <div id="newsletter">
              <form onSubmit={SubmitEmail}>
                <div className={`py-6 px-8 w-full border-2 rounded-full transition-all ${status ? 'border-[#F4B477]' : 'border-bluegreen'
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

            <p className='mt-12'>Other ways to get involved</p>
            <div className='text-bluegreen'>
              <div className='mt-4'>
                <Link href='/events'><a>Check out our latest events</a></Link>
              </div>
            </div>
            <div className='mt-4'>
              <ExternalLink label='Support our Initiative' href='https://giving.emerson.edu/give-now?fid=h0ZJD8gm3R4%3d&fdesc=i%2bI0v73Km%2bQCb1p7mjPYeYE68k%2f8URMG' />
            </div>
          </div>

          <div className="mt-14 xl:mt-16 xl:ml-12 w-full">
            {/* <img alt='placeholder!!!' src='https://www.dishwasherhero.com/wp-content/uploads/2020/01/orange-circle-background.png' className="xl:w-3/5 mx-auto" /> */}
            <h3 className='mt-8 text-xl font-semibold text-bluegreen'>Emerson College students</h3>

            <div className='mt-4'>
              <ExternalLink label='Learn about upcoming social impact studios' href='https://elab.emerson.edu/studios' />
              <p className='leading-7'>
                Social impact studios are interdisciplinary classes at Emerson that work alongside community partners on issue-based
                projects, like gun violence
              </p>
            </div>
            <div className='mt-8'>
              <p className='font-semibold'>Learn about the Engagement Lab co-curricular</p>
              <p className='leading-7'>
                The ELab co-curricular is a one credit opportunity to work closely with ELab faculty on collaborative projects or
                research
              </p>
            </div>
            <div className='mt-8'>
              <ExternalLink label='Work at the Engagement Lab' href='https://elab.emerson.edu/jobs' />
              <p className='leading-7'>
                ELab hires students every year across disciplines to contribute to the work of ELab in communications, visual design,
                videography, coding, event planning, and more.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-14 mb-14 w-full xl:flex">
          <div className="mt-14 xl:mt-16 w-full">
            {/* <img alt='placeholder!!!' src='https://www.dishw/'asherhero.com/wp-content/uploads/2020/01/orange-circle-background.png' className="xl:w-3/5 mx-auto" /> */}
            <h3 className='mt-8 text-xl font-semibold text-bluegreen'>Emerson College faculty</h3>

            <div className='mt-4'>
              <p className='font-semibold'>Participate in the summer workshop in collaborative pedagogy</p>
              <p className='leading-7'>
              Each May, the Engagement Lab hosts a 3-day workshop on collaborative pedagogy, open for all Emerson faculty interested in teaching social impact studios
              </p>
            </div>
            <div className='mt-8'>
              <p className='font-semibold'>Become an Engagement Lab fellow</p>
              <p className='leading-7 text-purple'>
            Engagement Lab fellows are ..........?
              </p>
            </div>
            <div className='mt-8'>
              <p className='font-semibold'>Teach a studio</p>
              <p>
                The Engagement Lab supports faculty to design and teach studios within our social impact initiatives, including coordinating with partners
              </p>
            </div>
            <div className='mt-8'>
              <p className='font-semibold'>Become an Initiative Captain</p>
              <p className='leading-7'>
                Initiative captains are one year appointments that place faculty in a leadership role within the initiative to work with the collaborative leadership team to shape priorities, onboard partners, and make connections to Emerson faculty and students.
              </p>
            </div>
          </div>

          <div className="mt-14 xl:mt-16 xl:ml-12 w-full">
            {/* <img alt='placeholder!!!' src='https://www.dishwasherhero.com/wp-content/uploads/2020/01/orange-circle-background.png' className="xl:w-3/5 mx-auto" /> */}

            <h3 className='mt-8 text-xl font-semibold text-bluegreen'>Boston-area community organizations and individuals</h3>

            <div className='mt-4'>
              <p className='font-semibold'>Be a guest speaker</p>
              <p className='leading-7'>
              How has your life been impacted by gun violence? How are you working toward peace, healing, and justice? Come share your story with an Emerson class.
              </p>
            </div>
            <div className='mt-8'>
              <p className='font-semibold'>Collaborate with a studio</p>
              <p className='leading-7'>
              We are looking for groups, organizations, or individuals with direct experience with the issue of gun violence to work alongside students and faculty over the course of a full semester. Studio collaborators help shape studio projects and are active participants in the co-creation process. Collaborators receive a certificate and honorarium for their participation.
              </p>
            </div>
            <div className='mt-8'>
              <p className='font-semibold'>Tell us what you’re up to</p>
              <p className='leading-7'>
              We are always seeking to learn more about the work happening on the ground.
              </p>
            </div>
          </div>

        </div>
      </div>
    </Layout>


  );
}
