import { forwardRef } from "react";

const Logo = forwardRef((props, ref) => {
  return (
    <div ref={ref} width="160" height="160" viewBox="-4 -4 133 136" fill="none">
      <img src="/捌程室內設計.png.avif" alt="" className="w-[80px]" />
    </div>
  );
});

export default Logo;
