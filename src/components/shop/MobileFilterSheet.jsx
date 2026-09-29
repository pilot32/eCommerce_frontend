import Drawer from '../ui/Drawer';
import Button from '../ui/Button';
import FilterSidebar from './FilterSidebar';

/**
 * Bottom drawer wrapping the shared FilterSidebar for small screens.
 * The footer "Apply" button simply closes the sheet (filtering is instant).
 *
 * @param {object} props
 * @param {boolean} props.open
 * @param {() => void} props.onClose
 * @param {object} props.filters
 * @param {(patch: object) => void} props.onChange
 * @param {() => void} props.onClearAll
 * @param {number} props.resultCount
 */
export default function MobileFilterSheet({
  open,
  onClose,
  filters,
  onChange,
  onClearAll,
  resultCount,
}) {
  return (
    <Drawer
      open={open}
      onClose={onClose}
      side="bottom"
      title="Filters"
      footer={
        <Button fullWidth onClick={onClose}>
          {`Show ${resultCount} ${resultCount === 1 ? 'result' : 'results'}`}
        </Button>
      }
    >
      <div className="px-5 py-6">
        <FilterSidebar filters={filters} onChange={onChange} onClearAll={onClearAll} />
      </div>
    </Drawer>
  );
}
