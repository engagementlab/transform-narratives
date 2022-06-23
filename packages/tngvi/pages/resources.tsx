import Link from "next/link";
import Layout from "../components/Layout";

export default function Resources() {

  return (
      <Layout>
          <div className="container mx-auto min-h-fit mt-14 mb-24 xl:mt-16 px-4 xl:px-8">

              <h1 className="text-2xl text-bluegreen font-semibold">
                  Resources
              </h1>
              <p className="w-full lg:w-1/2 xl:w-1/3">If you or someone you know has been impacted by gun violence and
                  are in need of support or services, please see below for resources.</p>

              <ul className="text-bluegreen">
                  <li>
                      <Link
                          href="https://bphc.org/whatwedo/mental-emotional-health/trauma-response-and-recovery/Pages/Trauma-Response-and-Recovery.aspx">
                      Boston Neighborhood Trauma Team</Link>
                  </li>
                  <li>
                      <Link href="https://ldbpeaceinstitute.org/">Louis D. Brown Peace Institute</Link>
                  </li>
                  <li>
                      <Link href="https://www.mass.gov/orgs/askmova">Massachusetts Office of Victim Assistance</Link>
                  </li>
              </ul>

          </div>
      </Layout>
  );
}
