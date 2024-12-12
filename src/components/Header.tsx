import { motion } from "framer-motion";
import GradualSpacing from "./ui/gradual-spacing";

function Header() {
  return (
    <div className="pt-10 md:pt-14 flex align-middle flex-col items-center px-4 md:px-0 ">
      <div className="text-center space-y-4 md:space-y-5 max-w-sm md:max-w-2xl mx-auto shadow-2xl bg-black/20 p-2 md:p-4 rounded-2xl">
        <motion.h1
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-blue-50 dark:text-white border-black dark:border-white tracking-tight"
        >
          Mainosmestari
        </motion.h1>

        {/* <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="font-display text-lg md:text-xl lg:text-2xl font-medium text-blue-50 dark:text-white tracking-tight"
        >
          Tekoälypohjainen mainoskuvageneraattori
        </motion.div> */}

        <GradualSpacing
          duration={0.3}
          delayMultiple={0.02}
          className="font-display text-sm md:text-lg font-normal text-blue-50 dark:text-gray-300 -tracking-wider md:-tracking-widest"
          text="Luo vaikuttavia mainoskuvia ja tekstejä hetkessä"
        />
      </div>
    </div>
  );
}

export default Header;
