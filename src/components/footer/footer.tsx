const Footer = () => {
  return (
    <footer className="bg-white dark:bg-black text-black dark:text-white border-t border-gray-200 dark:border-orange-900 p-4 mt-auto transition-colors duration-300">
      <p className="text-sm text-center">
        &copy; {new Date().getFullYear()}{" "}
        <span className="text-orange-600 dark:text-orange-400 font-semibold">
          FitSmart
        </span>
        . All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
