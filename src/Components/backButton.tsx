import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { Link } from '@tanstack/react-router';

const BackButton = () => {
  return (
    <Link to="/" className="flex gap-2 items-center text-xl cursor-pointer mb-4">
      <KeyboardBackspaceIcon />
      <span>Back Home</span>
    </Link>
  );
};

export default BackButton;
