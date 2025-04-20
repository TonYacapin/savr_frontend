import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

function GiftPetsPage() {
  const [pets, setPets] = useState([]);
  const [selectedPetId, setSelectedPetId] = useState('');
  const [recipientUserId, setRecipientUserId] = useState('');
  const [message, setMessage] = useState('');

  // Fetch user's pets
  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await axiosInstance.get('/pets');
        setPets(response.data);
      } catch (error) {
        console.error('Error fetching pets:', error);
      }
    };

    fetchPets();
  }, []);

  // Handle gifting a pet
  const handleGiftPet = async () => {
    if (!selectedPetId || !recipientUserId) {
      setMessage('Please select a pet and enter a recipient user ID.');
      return;
    }

    try {
      const response = await axiosInstance.post(`/pets/gift/${selectedPetId}/${recipientUserId}`);
      setMessage(response.data.message);
      setSelectedPetId('');
      setRecipientUserId('');
    } catch (error) {
      console.error('Error gifting pet:', error);
      setMessage(error.response?.data?.error || 'An error occurred.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gift Your Pets</h1>

      {/* Display user's pets */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Your Pets</h2>
        {pets.length > 0 ? (
          <ul className="space-y-2">
            {pets.map((pet) => (
              <li key={pet._id} className="p-2 border rounded shadow">
                <div>
                  <strong>Name:</strong> {pet.name}
                </div>
                <div>
                  <strong>Type:</strong> {pet.type}
                </div>
                <div>
                  <strong>Rarity:</strong> {pet.rarity}
                </div>
                <button
                  className={`mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${
                    selectedPetId === pet._id ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  onClick={() => setSelectedPetId(pet._id)}
                  disabled={selectedPetId === pet._id}
                >
                  {selectedPetId === pet._id ? 'Selected' : 'Select'}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>You have no pets.</p>
        )}
      </div>

      {/* Gift pet form */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Gift a Pet</h2>
        <div className="mb-2">
          <label className="block font-medium mb-1">Recipient User ID:</label>
          <input
            type="text"
            value={recipientUserId}
            onChange={(e) => setRecipientUserId(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter recipient user ID"
          />
        </div>
        <button
          onClick={handleGiftPet}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Gift Pet
        </button>
      </div>

      {/* Message */}
      {message && <div className="mt-4 p-2 bg-yellow-100 border-l-4 border-yellow-500">{message}</div>}
    </div>
  );
}

export default GiftPetsPage;