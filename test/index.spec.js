import * as React from "react";
import { GlotProvider, useGlot, Glot } from "../src/index";
import renderer from "react-test-renderer";
import { format as formatDate } from "date-fns/fp";

const dict = {
	en: {
		greeting: "hello",
		date: "yyyy-MM-dd",
		sales: {
			CTA: "Buy our Shit!",
		},
	},
	fra: {
		greeting: "bonjour",
		date: "yyyy-MM-dd",
		sales: {
			CTA: "Buy le Shite!",
		},
	},
};

describe("GlotProvider", () => {
	it("provides glot through context, scoped to the correct lang", () => {
		const rendered = renderer.create(
			<GlotProvider dict={dict} lang="en">
				<Glot>greeting</Glot>
			</GlotProvider>,
		);

		expect(rendered.toJSON()).toBe("hello");
	});

	it("overrides the lang of the provided glot", () => {
		const rendered = renderer.create(
			<GlotProvider dict={dict} lang="en">
				<GlotProvider lang="fra">
					<Glot>greeting</Glot>
				</GlotProvider>
			</GlotProvider>,
		);

		expect(rendered.toJSON()).toBe("bonjour");
	});
});

describe("useGlot", () => {
	it("returns a fully fledged glot instance", () => {
		const WithUseGlot = () => {
			const glot = useGlot();

			const dateFormatter = glot({ mkFn: formatDate })`date`;
			const date = new Date("2019-02-06 14:59:26");
			return (
				<React.Fragment>
					{glot`greeting`}, it is {dateFormatter(date)}
				</React.Fragment>
			);
		};

		const rendered = renderer.create(
			<GlotProvider dict={dict} lang="en">
				<WithUseGlot />
			</GlotProvider>,
		);

		expect(rendered.toJSON()).toEqual(["hello", ", it is ", "2019-02-06"]);
	});
});

describe("Glot", () => {
	it("substitutes its children for a glot string", () => {
		const rendered = renderer.create(
			<GlotProvider dict={dict} lang="en">
				<Glot>greeting</Glot>
			</GlotProvider>,
		);

		expect(rendered.toJSON()).toBe("hello");
	});

	it("substitutes, quay for a glot string", () => {
		const rendered = renderer.create(
			<GlotProvider dict={dict} lang="en">
				<Glot quay="greeting" />
			</GlotProvider>,
		);

		expect(rendered.toJSON()).toBe("hello");
	});

	it("applies value to mkFn uusing quay", () => {
		const rendered = renderer.create(
			<GlotProvider dict={dict} lang="en">
				<Glot
					quay="date"
					mkFn={formatDate}
					value={new Date("2019-02-06 14:59:26")}
				/>
			</GlotProvider>,
		);

		expect(rendered.toJSON()).toBe("2019-02-06");
	});
});
