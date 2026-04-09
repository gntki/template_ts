import * as S from './intro.style.ts'
import {useLayoutEffect, useRef} from "react";
import {Controller} from "three/scenes/base.ts";


export const Intro = () => {
  const sceneRef = useRef<HTMLCanvasElement | null>(null);

  useLayoutEffect(() => {
    if (!sceneRef.current) {
      return;
    }

    const controller = new Controller(sceneRef.current, {
      w: window.innerWidth,
      h: window.innerHeight,
    });

    return () => {
      controller.destroy();
    };
  }, []);


  return (
    <S.IntroStyled>
      <S.Canvas ref={sceneRef}/>
    </S.IntroStyled>
  )
}

export default Intro
