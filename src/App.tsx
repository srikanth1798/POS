import { BrowserRouter } from 'react-router-dom';
import Layout from './components/layout/Layout';
import AppRoutes from './routes/AppRoutes';
import './styles/global.css';
import './../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { ProductProvider } from './context/ProductContext';

function App() {
  return (
    <ProductProvider>
      <BrowserRouter>
        <Layout>
          <AppRoutes />
        </Layout>
      </BrowserRouter>
    </ProductProvider>
  );
}

export default App;
