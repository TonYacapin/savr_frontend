const StatBar = ({ value, color }) => {
    return (
      <div className="h-1 bg-gray-600 mt-1 rounded-full overflow-hidden">
        <div 
          className={`h-full ${color} rounded-full`}
          style={{ width: `${Math.min(100, value)}%` }}
        ></div>
      </div>
    );
  };
  
  export default StatBar;