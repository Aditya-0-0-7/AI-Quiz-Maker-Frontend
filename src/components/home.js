import './home.css';
import React, { useEffect, useRef, useState } from "react";
import Page1 from './homePage1';
function Home()
{
    const containersRef = useRef([]);  // Array of container references
    const [visibleItems, setVisibleItems] = useState([]); // Track visibility for multiple containers

    useEffect(() => {
        const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setVisibleItems((prevVisibleItems) => {
                const newVisibleItems = [...prevVisibleItems];
                newVisibleItems[index] = true;
                return newVisibleItems;
                });
            }
            });
        },
        {
            threshold: 0.1, // 10% visible before triggering
        }
        );

        containersRef.current.forEach((container) => {
        if (container) observer.observe(container);
        });

        return () => {
        containersRef.current.forEach((container) => {
            if (container) observer.unobserve(container);
        });
        };
    }, []);

    function setRef(index,element)
    {
        containersRef.current[index] = element
    }

    return(
    <div id='home'>
        <section id='pages'>
            <Page1 visibleItems={visibleItems} setRef={setRef}/>
        </section>
    </div>
    );
}
export default Home;