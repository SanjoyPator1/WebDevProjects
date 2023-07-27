//nav bar model
export interface navBarObjModel {
    name : string;
    link : string;
}

export interface navBarModel {
    navBarData : navBarObjModel[];
    backgroundColor?: string;
    textColor? : string;
    onFocusTextColor? : string;
    activeTabBackgroundColor? : string;
    activeTabTextColor? : string;
}