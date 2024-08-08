import type { KeyboardEvent } from "react";
import { useRef, useState, type ReactNode } from "react";

import { formatISOFullTime } from "@/utils/time";

function InfoLog({ children }: { children: ReactNode }) {
    return (
        <div>
            <span className="text-amber-400">
                [{formatISOFullTime(new Date())} INFO]
            </span>
            : {children}
        </div>
    );
}

export function Terminal() {
    const [cmd, setCmd] = useState("");
    const [args, setArgs] = useState("");
    const [loading, setLoading] = useState("");
    const [output, setOutput] = useState<ReactNode>(null);
    const [success, setSuccess] = useState<ReactNode>(null);
    const [input, setInput] = useState<ReactNode>(null);
    const [cmdOutput, _setCmdOutput] = useState<ReactNode>(null);


    const cmdOutputRef = useRef(cmdOutput);

    function setCmdOutput(data: ReactNode[]) {
        cmdOutputRef.current = data;
        _setCmdOutput(data);
    }

    const handleCommand = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            let currentCmdOutput;
            switch (event.currentTarget.value) {
                case "help": {
                    currentCmdOutput =
                        "Existing commands: help, downloads, plugins, docs, forums, team, contribute";
                    break;
                }
                case "downloads": {
                    window.location.href = "/downloads";
                    currentCmdOutput = "Redirecting...";
                    break;
                }
                case "plugins": {
                    window.location.href = "https://hangar.papermc.io";
                    currentCmdOutput = "Redirecting...";
                    break;
                }
                case "docs": {
                    window.location.href = "https://docs.papermc.io";
                    currentCmdOutput = "Redirecting...";
                    break;
                }
                case "forums": {
                    window.location.href = "https://forums.papermc.io";
                    currentCmdOutput = "Redirecting...";
                    break;
                }
                case "team": {
                    window.location.href = "/team";
                    currentCmdOutput = "Redirecting...";
                    break;
                }
                case "contribute": {
                    window.location.href = "/contribute";
                    currentCmdOutput = "Redirecting...";
                    break;
                }
                default: {
                    currentCmdOutput = 'Unknown command. Type "help" for help.';
                }
            }
            setCmdOutput([
                cmdOutputRef.current,
                <div key={event.currentTarget.id}>
                    {">"} {event.currentTarget.value}
                </div>,
                <InfoLog key={2}>{currentCmdOutput}</InfoLog>,
            ]);
            event.currentTarget.value = "";
        }
    };

    return (
        <div className="max-h-82 w-120 h-283 rounded-lg bg-gray-800">
            <div className="w-full bg-gray-900 rounded-t-lg flex p-2 gap-2">
                <div className="w-2.5 h-2.5 bg-red-500 rounded-full" />
                <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full" />
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full" />
            </div>
            <div className="max-h-74 p-4 font-mono text-xs text-white overflow-y-hidden flex flex-col-reverse">
                {input}
                <div>{cmdOutput}</div>
                <div>{success}</div>
                <div>{output}</div>
                <div>
                    <span className="text-gray-400">{loading}</span>
                </div>
                <div>
                    <span className="text-green-400">$ </span>
                    <span className="text-blue-400">{cmd}</span>
                    <span>{args}</span>
                </div>
            </div>
        </div>
    );
}