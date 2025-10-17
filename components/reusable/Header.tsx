'use client';
import Link from 'next/link';
import clsx from 'clsx';
import HamburgerMenu from './Menu/HamburgerMenu';

const Header = () => {
    return (
        <div className={clsx(
            'sticky top-0 z-50',
            'bg-[var(--background-color)]',
            'flex justify-between items-center',
            'px-4 md:px-8 py-4',
            'border-b-2 border-[var(--border-color)]'
        )}>
            <Link href='/kana' className='hover:opacity-80 transition-opacity'>
                <h1 className='text-3xl font-bold'>
                    <span className='text-[var(--main-color)]'>B-JET Kana</span>
                    <span className='text-[var(--secondary-color)] ml-2'>かな</span>
                </h1>
            </Link>
            <HamburgerMenu />
        </div>
    );
};

export default Header;
