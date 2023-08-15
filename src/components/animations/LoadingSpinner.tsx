type LoadingSpinnerProps = {
  small?: boolean;
  className?: string;
};

const LoadingSpinner = ({ small, className }: LoadingSpinnerProps) => {
  return (
    <div className={`loadingSpinner ${className ?? ''} ${small ? '[zoom:0.4]' : ''}`}>
      <div className="loadingSpinnerPoint_1 loadingSpinnerPoint"></div>
      <div className="loadingSpinnerPoint_2 loadingSpinnerPoint"></div>
      <div className="loadingSpinnerPoint_3 loadingSpinnerPoint"></div>
      <div className="loadingSpinnerPoint_4 loadingSpinnerPoint"></div>
      <div className="loadingSpinnerPoint_5 loadingSpinnerPoint"></div>
      <div className="loadingSpinnerPoint_6 loadingSpinnerPoint"></div>
      <div className="loadingSpinnerPoint_7 loadingSpinnerPoint"></div>
      <div className="loadingSpinnerPoint_8 loadingSpinnerPoint"></div>
    </div>
  );
};
export default LoadingSpinner;
