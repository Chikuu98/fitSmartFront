const Footer = () => {
  return (
    <footer className="bg-white dark:bg-black text-black dark:text-white p-4 mt-auto">
      <p className="text-sm text-center">
        &copy; {new Date().getFullYear()} All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
