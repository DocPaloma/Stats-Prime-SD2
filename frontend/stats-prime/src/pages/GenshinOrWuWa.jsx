import { useParams } from "react-router-dom";
import GenshinStats from "./GenshinStats";
import WutheringStats from "./WutheringStats";

export default function GameChoose() {
    const { gameId } = useParams();
    return gameId === "genshin" ? <GenshinStats /> : <WutheringStats />;
}