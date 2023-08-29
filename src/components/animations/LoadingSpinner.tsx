type LoadingSpinnerProps = {
  small?: boolean;
  className?: string;
};

const LoadingSpinner = ({ small, className }: LoadingSpinnerProps) => {
  return (
    <div className={`loading-spinner ${className ?? ''} ${small ? '[zoom:0.4]' : ''}`}>
      <div className="loading-spinner-point-1 loading-spinner-point"></div>
      <div className="loading-spinner-point-2 loading-spinner-point"></div>
      <div className="loading-spinner-point-3 loading-spinner-point"></div>
      <div className="loading-spinner-point-4 loading-spinner-point"></div>
      <div className="loading-spinner-point-5 loading-spinner-point"></div>
      <div className="loading-spinner-point-6 loading-spinner-point"></div>
      <div className="loading-spinner-point-7 loading-spinner-point"></div>
      <div className="loading-spinner-point-8 loading-spinner-point"></div>
    </div>
  );
};
export default LoadingSpinner;
