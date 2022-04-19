import Layout from "../components/Layout";

export default function NotFound() {

  return (
      <Layout>
          <div className="container mx-auto min-h-fit mt-14 mb-24 xl:mt-16 px-4 xl:px-8">

              <h1 className="text-2xl text-bluegreen font-semibold">
                  Not Found.
              </h1>
              <p className="w-full lg:w-1/2 xl:w-1/3">Sorry, but the page you're looking for could not be found.</p>
          </div>
      </Layout>
  );
}
