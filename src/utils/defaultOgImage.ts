export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;

export const OG_IMAGE_ALT =
  "André Lademann — engineering blog about cloud architecture, software development, and modern tooling.";

/** Dark-theme tokens from src/styles/theme.css */
export const OG_THEME = {
  background: "#212737",
  foreground: "#eaedf3",
  accent: "#ff6b01",
  muted: "#343f60",
  mutedForeground: "#afb9ca",
  border: "#ab4b08",
} as const;

type OgImageContent = {
  title: string;
  description: string;
  hostname: string;
};

export function createDefaultOgImageElement({
  title,
  description,
  hostname,
}: OgImageContent) {
  return {
    type: "div",
    props: {
      style: {
        background: OG_THEME.background,
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Google Sans Code",
        color: OG_THEME.foreground,
      },
      children: [
        {
          type: "div",
          props: {
            style: {
              position: "absolute",
              top: "-1px",
              right: "-1px",
              border: `4px solid ${OG_THEME.border}`,
              background: OG_THEME.muted,
              opacity: "0.9",
              borderRadius: "4px",
              margin: "2.5rem",
              width: "88%",
              height: "80%",
            },
          },
        },
        {
          type: "div",
          props: {
            style: {
              border: `4px solid ${OG_THEME.accent}`,
              background: OG_THEME.background,
              borderRadius: "4px",
              display: "flex",
              justifyContent: "center",
              margin: "2rem",
              width: "88%",
              height: "80%",
            },
            children: {
              type: "div",
              props: {
                style: {
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  margin: "20px",
                  width: "90%",
                  height: "90%",
                },
                children: [
                  {
                    type: "div",
                    props: {
                      style: {
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "90%",
                        maxHeight: "90%",
                        overflow: "hidden",
                        textAlign: "center",
                        gap: "24px",
                      },
                      children: [
                        {
                          type: "p",
                          props: {
                            style: {
                              fontSize: 72,
                              fontWeight: "bold",
                              color: OG_THEME.foreground,
                              margin: 0,
                              lineHeight: 1.1,
                            },
                            children: title,
                          },
                        },
                        {
                          type: "p",
                          props: {
                            style: {
                              fontSize: 28,
                              color: OG_THEME.mutedForeground,
                              margin: 0,
                              lineHeight: 1.4,
                              maxWidth: "90%",
                            },
                            children: description,
                          },
                        },
                      ],
                    },
                  },
                  {
                    type: "div",
                    props: {
                      style: {
                        display: "flex",
                        justifyContent: "flex-end",
                        width: "100%",
                        marginBottom: "8px",
                        fontSize: 28,
                      },
                      children: {
                        type: "span",
                        props: {
                          style: {
                            overflow: "hidden",
                            fontWeight: "bold",
                            color: OG_THEME.accent,
                          },
                          children: hostname,
                        },
                      },
                    },
                  },
                ],
              },
            },
          },
        },
      ],
    },
  };
}

export function createDefaultOgSatoriOptions(
  fonts: NonNullable<import("satori").SatoriOptions["fonts"]>
) {
  return {
    width: OG_IMAGE_WIDTH,
    height: OG_IMAGE_HEIGHT,
    embedFont: true,
    fonts,
  } as const;
}
