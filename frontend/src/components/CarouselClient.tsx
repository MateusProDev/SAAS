"use client";
import dynamic from "next/dynamic";
import "react-responsive-carousel/lib/styles/carousel.min.css";



const Carousel = dynamic(
  () =>
    import("react-responsive-carousel").then((mod) => 
      mod.Carousel as unknown as React.ComponentType<any>
    ),
  { ssr: false }
);

export default Carousel;
