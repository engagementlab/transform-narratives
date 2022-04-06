
export default function CMS() {
  setTimeout(() => {
    window.location.href = `https://cms.qa.transformnarratives.org/`;
  }, 2000); 

  return (
    <div className="flex justify-center items-center absolute w-full h-full">
      <h1 className="text-5xl">
        Sending you to Engagement Lab CMS...
      </h1>
    </div>
  );
}

export function getStaticProps() {
  return {
    // returns the default 404 page with a status code of 404 in production
     notFound: process.env.NODE_ENV !== 'test'
  }
}