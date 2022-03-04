
export default function CMS() {
  setTimeout(() => {
    window.location.href = `https://cms.qa.transformnarratives.org/`;
  }, 2000); 

  return (
    <div className="flex justify-center items-center absolute w-full h-full">
      <h1 className="font-bourbon text-5xl">
        Sending you to Engagement Lab CMS...
      </h1>
    </div>
  );
}