const RarityBadge = ({ rarity, small = false }) => {
    const rarityColors = {
      Common: 'bg-gray-100 text-gray-800',
      Uncommon: 'bg-green-100 text-green-800',
      Rare: 'bg-blue-100 text-blue-800',
      Epic: 'bg-purple-100 text-purple-800',
      Legendary: 'bg-yellow-100 text-yellow-800',
      Mythic: 'bg-gradient-to-r from-pink-500 to-red-500 text-white'
    };
  
    return (
      <span className={`${small ? 'px-1 py-0.5 text-xs' : 'px-2 py-1 text-xs'} rounded-full font-bold ${rarityColors[rarity]}`}>
        {rarity}
      </span>
    );
  };
  
  export default RarityBadge;