import { useDispatch } from "react-redux";
import {
  removeFromCartAsync,
  updateCartQuantityAsync,
} from "../features/cart/cartThunk";
import { Link } from "react-router-dom";

const CartItem = ({ product }) => {
  const dispatch = useDispatch();

  return (
    <tr className="border-b border-gray-700 bg-[#1f1f1f] transition">
      
      {/* IMAGE */}
      <td className="p-4">
        <img
          src={product.image || "/placeholder.png"}
          alt={product.name}
          className="w-20 h-20 object-contain mx-auto bg-white rounded-lg p-1"
        />
      </td>

      {/* NAME */}
      <td className="p-4 text-left">
        <p className="text-white font-medium line-clamp-2">
          <Link to={`/product/${product.id}`}>{product.name}</Link>
        </p>
      </td>

      {/* PRICE */}
      <td className="p-4 text-orange-400 font-semibold">
        ${product.price}
      </td>

      {/* QUANTITY */}
      <td className="p-4">
        <div className="flex items-center justify-center gap-2">
          
          <button
            onClick={() => {
              let qty = product.quantity - 1;
              if (qty < 1) qty = 1;
              if (qty > product.countInStock) qty = product.countInStock;
              dispatch(updateCartQuantityAsync({ id: product.id, quantity: qty }));
            }}
            className="w-8 h-8 flex items-center justify-center bg-gray-700 hover:bg-gray-600 rounded text-white"
          >
            −
          </button>

          <input
            type="number"
            value={product.quantity}
            onChange={(e) => {
              let qty = Number(e.target.value);
              if (qty < 1) qty = 1;
              if (qty > product.countInStock) qty = product.countInStock;
              dispatch(updateCartQuantityAsync({ id: product.id, quantity: qty }));
            }}
            className="w-14 text-center bg-gray-800 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
          />

          <button
            onClick={() => {
              let qty = product.quantity + 1;
              if (qty < 1) qty = 1;
              if (qty > product.countInStock) qty = product.countInStock;
              dispatch(updateCartQuantityAsync({ id: product.id, quantity: qty }));
            }}
            className="w-8 h-8 flex items-center justify-center bg-gray-700 hover:bg-gray-600 rounded text-white"
          >
            +
          </button>

        </div>
      </td>

      {/* TOTAL */}
      <td className="p-4 font-semibold text-green-400">
        ${((product.price || 0) * product.quantity).toFixed(2)}
      </td>

      {/* REMOVE */}
      <td className="p-4">
        <button
          onClick={() => dispatch(removeFromCartAsync(product.id))}
          className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-white text-sm transition"
        >
          <span>x</span>
        </button>
      </td>
    </tr>
  );
};

export default CartItem;
