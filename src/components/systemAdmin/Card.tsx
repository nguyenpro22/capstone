interface CardProps {
    title: string;
    value: string | number;
    change: string;
  }
  
  const Card: React.FC<CardProps> = ({ title, value, change }) => {
    return (
      <div className="bg-white shadow p-4 rounded-lg">
        <h3 className="text-sm font-bold">{title}</h3>
        <p className="text-lg font-semibold">{value}</p>
        <p className="text-sm text-green-500">{change}</p>
      </div>
    );
  };
  
  export default Card;
  