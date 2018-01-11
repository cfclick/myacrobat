import { WorkBench } from "./WorkBench";

interface IContactData{
    DisplayText:string;
    Email:string;
}

interface IGlobalScope{
    WorkBench : WorkBench;
}

declare var CONTACT_DATA: IContactData[];
declare var GLOBALSCOPE:IGlobalScope;