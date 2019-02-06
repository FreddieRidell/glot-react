import * as React from "react";
import createGlot from "@freddieridell/glot";

const GlotContext = React.createContext();

export const GlotProvider = ({ children, lang, dict }) => (
	<GlotContext.Consumer>
		{existingGlot => {
			if (existingGlot) {
				return (
					<GlotContext.Provider value={existingGlot({ lang })}>
						{children}
					</GlotContext.Provider>
				);
			} else {
				return (
					<GlotContext.Provider value={createGlot(dict)({ lang })}>
						{children}
					</GlotContext.Provider>
				);
			}
		}}
	</GlotContext.Consumer>
);

export const useGlot = () => {
	return React.useContext(GlotContext);
};

export const Glot = ({ children, quay, mkFn, value }) => (
	<GlotContext.Consumer>
		{glot =>
			mkFn ? glot({ mkFn })([quay])(value) : glot([quay || children])
		}
	</GlotContext.Consumer>
);
