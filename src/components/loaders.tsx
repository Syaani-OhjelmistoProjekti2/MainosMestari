function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)]">
      <div className="w-16 h-16 border-4 border-blue-900 border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-white dark:text-gray-400">Ladataan sovellusta...</p>
    </div>
  );
}
export default LoadingSpinner;
