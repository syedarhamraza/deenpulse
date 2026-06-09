import { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & {
  className?: string;
};

export function PhoneDownloadIcon({ className, ...props }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <rect x="6" y="2" width="12" height="20" rx="2.5" strokeWidth="2" />
      <line x1="10" y1="4.5" x2="14" y2="4.5" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      <line x1="10" y1="19.5" x2="14" y2="19.5" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <path
        className="dp-icon-phone-arrow"
        d="M12 7 v7 M9 11.5 l3 3 l3 -3"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function WatchSyncIcon({ className, ...props }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path d="M9 5.5 V2.5 h6 v3" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      <path d="M9 18.5 v3 h6 v-3" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      <circle cx="12" cy="12" r="6.5" strokeWidth="2" />
      <path d="M18.5 11 h0.8 v2 H18.5" strokeWidth="1.5" />
      <g className="dp-icon-watch-sync">
        <path d="M12 9 A3 3 0 0 1 15 12" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M13 11 L15 12 L16 10" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 15 A3 3 0 0 1 9 12" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M11 13 L9 12 L8 14" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

export function DownloadArrowIcon({ className, ...props }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path d="M12 3 v12" strokeWidth="2" strokeLinecap="round" />
      <path
        className="dp-icon-download-arrow"
        d="M7 10 l5 5 l5 -5"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M4 20 h16" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

export function GithubIcon({ className, ...props }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path
        d="M9 19 c-4 1.5 -4 -2 -4 -2 s-1 -3 1 -4.5 c-1 -2.5 0.5 -2.5 0.5 -2.5 s1 -0.5 1.5 0 c1 0 2 0 3 0 s2 0 3 0 c0.5 -0.5 1.5 0 1.5 0 s1.5 0 0.5 2.5 c2 1.5 1 4.5 1 4.5 s0 3.5 -4 2"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle className="dp-icon-github-dot" cx="9.5" cy="9.5" r="0.8" fill="currentColor" stroke="none" />
      <circle className="dp-icon-github-dot" cx="14.5" cy="9.5" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function ArrowUpIcon({ className, ...props }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path d="M12 19 V5" strokeWidth="2" strokeLinecap="round" />
      <path
        className="dp-icon-arrow-up"
        d="M7 10 l5 -5 l5 5"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SyncIcon({ className, ...props }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <g className="dp-icon-sync-group">
        <path d="M4 12 a8 8 0 0 1 13.5 -5.5" strokeWidth="2" strokeLinecap="round" />
        <path d="M16 4 v4 h-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M20 12 a8 8 0 0 1 -13.5 5.5" strokeWidth="2" strokeLinecap="round" />
        <path d="M8 20 v-4 h4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

export function CopyIcon({ className, ...props }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <rect x="8" y="8" width="12" height="12" rx="2" strokeWidth="1.8" className="dp-icon-copy-back" opacity="0.5" />
      <rect x="4" y="4" width="12" height="12" rx="2" strokeWidth="2" className="dp-icon-copy-front" />
    </svg>
  );
}

export function ExternalLinkIcon({ className, ...props }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path d="M14 3 h7 v7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 14 L21 3" strokeWidth="2" strokeLinecap="round" />
      <path d="M21 14 v7 H3 V3 h7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
      <path
        className="dp-icon-external-arrow"
        d="M14 10 l7 -7"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function DocsIcon({ className, ...props }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path d="M6 4 h8 l4 4 v12 a2 2 0 0 1 -2 2 H6 a2 2 0 0 1 -2 -2 V6 a2 2 0 0 1 2 -2 z" strokeWidth="2" strokeLinejoin="round" />
      <path d="M14 4 v4 h4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
      <path className="dp-icon-docs-line" d="M8 12 h8" strokeWidth="1.8" strokeLinecap="round" />
      <path className="dp-icon-docs-line" d="M8 16 h5" strokeWidth="1.8" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

export type PremiumIconName =
  | 'phone-download'
  | 'watch-sync'
  | 'download'
  | 'github'
  | 'arrow-up'
  | 'sync'
  | 'copy'
  | 'external'
  | 'docs';

const iconMap = {
  'phone-download': PhoneDownloadIcon,
  'watch-sync': WatchSyncIcon,
  download: DownloadArrowIcon,
  github: GithubIcon,
  'arrow-up': ArrowUpIcon,
  sync: SyncIcon,
  copy: CopyIcon,
  external: ExternalLinkIcon,
  docs: DocsIcon,
} as const;

export function PremiumIcon({
  name,
  className,
}: {
  name: PremiumIconName;
  className?: string;
}) {
  const Icon = iconMap[name];
  return <Icon className={className} />;
}
