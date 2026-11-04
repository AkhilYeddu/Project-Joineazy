const Footer = () => {
  return (
    <footer className="bottom-0 fixed footer sm:footer-horizontal footer-center bg-base-300 text-base-content p-4">
        <aside>
            <p>Copyright © {new Date().getFullYear()} - All right reserved by ACME Industries Ltd</p>
        </aside>
        </footer>
  )
}

export default Footer