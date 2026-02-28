globalThis.process ??= {}; globalThis.process.env ??= {};
const offering1 = new Proxy({"src":"/_astro/offering-1-resources.B24-_-FL.png","width":800,"height":600,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "C:/Users/Business/Website v2.36/src/PageImages/Services/offering-1-resources.png";
							}
							
							return target[name];
						}
					});

const offering2 = new Proxy({"src":"/_astro/offering-2-whitelabel.Bu8hJrxi.png","width":800,"height":600,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "C:/Users/Business/Website v2.36/src/PageImages/Services/offering-2-whitelabel.png";
							}
							
							return target[name];
						}
					});

const offering3 = new Proxy({"src":"/_astro/offering-3-custom.DqF_PXHE.png","width":800,"height":600,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "C:/Users/Business/Website v2.36/src/PageImages/Services/offering-3-custom.png";
							}
							
							return target[name];
						}
					});

export { offering2 as a, offering1 as b, offering3 as o };
