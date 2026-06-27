export const NAV_STYLES = `
  .dash-border {
    position: relative;
  }
  .dash-border::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background-image: url("data:image/svg+xml,%3Csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='none' stroke='rgba(255,255,255,0.5)' stroke-width='1' stroke-dasharray='3 5' /%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    pointer-events: none;
  }
  @keyframes waterDown {
    0% { clip-path: inset(0 0 100% 0); }
    100% { clip-path: inset(0 0 0 0); }
  }
  @keyframes waterUp {
    0% { clip-path: inset(0 0 0 0); }
    100% { clip-path: inset(0 0 100% 0); }
  }
`;
