// MUI Material Icons — semua ikon yang tersedia di CMS
import Language from '@mui/icons-material/Language';
import MenuBook from '@mui/icons-material/MenuBook';
import GitHub from '@mui/icons-material/GitHub';
import LinkedIn from '@mui/icons-material/LinkedIn';
import WhatsApp from '@mui/icons-material/WhatsApp';
import YouTube from '@mui/icons-material/YouTube';
import Email from '@mui/icons-material/Email';
import Instagram from '@mui/icons-material/Instagram';
import Twitter from '@mui/icons-material/Twitter';
import Facebook from '@mui/icons-material/Facebook';
import Telegram from '@mui/icons-material/Telegram';
import Chat from '@mui/icons-material/Chat';
import Phone from '@mui/icons-material/Phone';
import Code from '@mui/icons-material/Code';
import Work from '@mui/icons-material/Work';
import Person from '@mui/icons-material/Person';
import Article from '@mui/icons-material/Article';
import School from '@mui/icons-material/School';
import ShoppingCart from '@mui/icons-material/ShoppingCart';
import VideoLibrary from '@mui/icons-material/VideoLibrary';
import Podcasts from '@mui/icons-material/Podcasts';
import OpenInNew from '@mui/icons-material/OpenInNew';
import Link from '@mui/icons-material/Link';
import Star from '@mui/icons-material/Star';
import Favorite from '@mui/icons-material/Favorite';
import MusicNote from '@mui/icons-material/MusicNote';
import CameraAlt from '@mui/icons-material/CameraAlt';
import SportsEsports from '@mui/icons-material/SportsEsports';
import TravelExplore from '@mui/icons-material/TravelExplore';
import BusinessCenter from '@mui/icons-material/BusinessCenter';

export const ICON_MAP = {
  // Social Media Brands
  github: GitHub,
  linkedin: LinkedIn,
  whatsapp: WhatsApp,
  youtube: YouTube,
  instagram: Instagram,
  twitter: Twitter,
  facebook: Facebook,
  telegram: Telegram,

  // Communication
  email: Email,
  chat: Chat,
  phone: Phone,

  // Content & Work
  web: Language,
  book: MenuBook,
  article: Article,
  code: Code,
  work: Work,
  portfolio: BusinessCenter,
  school: School,

  // Media
  video: VideoLibrary,
  podcast: Podcasts,
  music: MusicNote,
  photo: CameraAlt,

  // Misc
  person: Person,
  shop: ShoppingCart,
  game: SportsEsports,
  travel: TravelExplore,
  star: Star,
  heart: Favorite,
  link: Link,
  open: OpenInNew,

  // Legacy aliases (backward compat dari config lama)
  globe: Language,
  message: Chat,
  mail: Email,
};
