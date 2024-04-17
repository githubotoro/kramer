import clsx from "clsx";

export const Loader = ({ classes }) => {
  return (
    <div
      className={clsx(
        "flex flex-col items-center place-content-center w-full h-screen",
        classes
      )}
    >
      <div
        className="inline-block h-6 w-6 animate-spin rounded-full border-[4px] border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
        role="status"
      >
        <span class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
          Loading...
        </span>
      </div>
    </div>
  );
};
