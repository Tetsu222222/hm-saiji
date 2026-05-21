import type { FoodItem, ValidationErrors } from '../types';

interface Props {
  items: FoodItem[];
  errors: ValidationErrors;
  onChange: (items: FoodItem[]) => void;
}

export default function FoodItemsForm({ items, errors, onChange }: Props) {
  const update = (index: number, field: keyof FoodItem, value: string) => {
    const next = items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    onChange(next);
  };

  const addItem = () => {
    onChange([...items, { name: '', quantity: '' }]);
  };

  const removeItem = (index: number) => {
    if (items.length <= 1) return;
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div className="food-items">
      {errors['foodItems'] && (
        <p className="field-error">{errors['foodItems']}</p>
      )}

      <div className="food-items-header">
        <span className="food-col-no">番号</span>
        <span className="food-col-name">食品名</span>
        <span className="food-col-qty">予定食数</span>
        <span className="food-col-action"></span>
      </div>

      {items.map((item, i) => (
        <div key={i} className="food-item-row">
          <span className="food-col-no food-no-label">{i + 1}</span>

          <div className="food-col-name">
            <input
              type="text"
              value={item.name}
              onChange={(e) => update(i, 'name', e.target.value)}
              placeholder="食品名"
              className={errors[`foodItems[${i}].name`] ? 'input-error' : ''}
            />
            {errors[`foodItems[${i}].name`] && (
              <p className="field-error">{errors[`foodItems[${i}].name`]}</p>
            )}
          </div>

          <div className="food-col-qty">
            <input
              type="number"
              value={item.quantity}
              onChange={(e) => update(i, 'quantity', e.target.value)}
              placeholder="0"
              min="0"
              className={errors[`foodItems[${i}].quantity`] ? 'input-error' : ''}
            />
            {errors[`foodItems[${i}].quantity`] && (
              <p className="field-error">{errors[`foodItems[${i}].quantity`]}</p>
            )}
          </div>

          <div className="food-col-action">
            <button
              type="button"
              onClick={() => removeItem(i)}
              disabled={items.length <= 1}
              className="btn-remove"
              aria-label={`食品${i + 1}を削除`}
            >
              削除
            </button>
          </div>
        </div>
      ))}

      {items.length < 18 && (
        <button type="button" onClick={addItem} className="btn-add">
          + 食品を追加
        </button>
      )}
    </div>
  );
}
