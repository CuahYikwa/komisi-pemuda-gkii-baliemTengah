import logo from '../assets/images/logo.jpg';

export function LogoMark({ className = 'w-10 h-10' }: { className?: string }) {
  return (
    <img
      src={logo}
      className={`${className} object-cover rounded-full`}
      alt="Logo GKII Baliem Tengah"
      loading="eager"
    />
  );
}
