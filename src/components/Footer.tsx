import React from "react";

interface Props {
    color?: string;
}

export default function Footer(p : Props) {
    return (
            <footer>

                
                <p style={{color: p.color}}>Made with <span style={{color: "red"}}>&hearts;</span> in France</p>
                <a style={{color: p.color}} href="https://github.com/kevinfosse/pet-simulator">Virtuel Pet <img src="git" alt="" /> </a>
                

            </footer>
    )}