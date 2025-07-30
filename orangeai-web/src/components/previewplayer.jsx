function PreviewPlayer({ originalSrc, dubbedSrc }) {
  return (
    <div className="flex flex-col md:flex-row gap-6 mt-6 justify-center">
      <div className="flex-1 text-center">
        <h3 className="text-lg font-semibold mb-2">Original Video</h3>
        <video controls className="w-full max-w-md mx-auto rounded shadow">
          <source src={originalSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <div className="flex-1 text-center">
        <h3 className="text-lg font-semibold mb-2">Dubbed Video</h3>
        <video controls className="w-full max-w-md mx-auto rounded shadow">
          <source src={dubbedSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
}

export default PreviewPlayer;
