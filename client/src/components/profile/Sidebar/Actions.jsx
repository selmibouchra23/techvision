import { useEffect } from 'react';
import { auth } from '../../firebase'; // Assurez-vous que le chemin est correct
import { signOut } from 'firebase/auth';
import { Button, VStack, Icon } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi'; // Import de l'icône logout

export default function Actions() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/'); // Redirection vers la page de connexion après la déconnexion
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return (
    <VStack py={8} px={5} spacing={3}>
      <Button 
        
        onClick={handleLogout} 
        colorScheme="red" 
        leftIcon={<Icon as={FiLogOut}  />} // Ajout de l'icône logout
        borderRadius="2"
        w="100%"
      >
        Log Out
      </Button>
    </VStack>
  );
}
