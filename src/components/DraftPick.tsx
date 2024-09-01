const badgeStyles: any = {
  QB: 'error',
  WR: 'success',
  RB: 'info',
  TE: 'warning',
  K: 'primary',
  DEF: 'default',
};

const Overlay = () => (
  <div className="h-full w-full absolute top-0 right-0 bg-base-100 opacity-75" />
);

export default function DraftPick({
  pick,
  currentPick,
  positionNumber,
  position,
}: {
  pick: any;
  currentPick: number;
  position: string;
  positionNumber: number;
}) {
  return (
    <div className="relative">
      <div className="flex items-center my-1">
        <div className="w-12 text-center">
          <span className="text-lg font-bold">{pick.pick_no}</span>
        </div>
        <button className={`btn btn-xs btn-${badgeStyles[position]} w-24 mr-2`}>
          {pick.metadata.position}
          <div className="badge badge-neutral">
            {positionNumber > 0 ? positionNumber : '-'}
          </div>
        </button>
        <span className="text-lg flex-grow">
          {pick.metadata.first_name} {pick.metadata.last_name}
          <span className="text-xs justify-self-end">
            {`, ${pick.metadata.team}`}
          </span>
        </span>

        <span className="text-xs justify-self-end">
          Slot {pick.draft_slot}{' '}
        </span>
      </div>
      {pick.pick_no > currentPick && <Overlay />}
    </div>
  );
}
