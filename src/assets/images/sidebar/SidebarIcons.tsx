import * as React from 'react';

interface SidebarIconsProps {
    name: string;
    className?: string;
}

export const SidebarIcons: React.FC<SidebarIconsProps> = (props: SidebarIconsProps) => {
    switch (props.name) {
        case 'history':
            return (
                <svg width="20" height="20" className={props.className} viewBox="0 0 20 20" fill="none">
                    <path d="M10 0C9.67613 0 9.41406 0.26207 9.41406 0.585938C9.41406 0.909805 9.67613 1.17188 10 1.17188C14.8466 1.17188 18.8281 5.15344 18.8281 10C18.8281 14.8466 14.8466 18.8281 10 18.8281C5.15344 18.8281 1.17188 14.8466 1.17188 10C1.17188 7.64387 2.20316 5.38668 3.86719 3.7441V4.72656C3.86719 5.05043 4.12926 5.3125 4.45312 5.3125C4.77699 5.3125 5.03906 5.05043 5.03906 4.72656V2.38281C5.03906 2.05895 4.75746 1.79688 4.43359 1.79688H2.08984C1.76598 1.79688 1.50391 2.05895 1.50391 2.38281C1.50391 2.70668 1.76598 2.96484 2.08984 2.96484H2.97117C1.12082 4.82109 0 7.35664 0 10C0 15.4926 4.50742 20 10 20C15.4926 20 20 15.4926 20 10C20 4.50742 15.4926 0 10 0Z" fill="var(--icons)"/>
                    <path d="M15.8594 10.5859C15.5355 10.5859 15.2734 10.3239 15.2734 10C15.2734 9.67613 15.5355 9.41406 15.8594 9.41406H16.4156C16.2943 8.07645 15.7648 6.85559 14.95 5.87863L14.5575 6.27109C14.3285 6.50012 13.9579 6.50012 13.7289 6.27109C13.4999 6.04207 13.4999 5.67148 13.7289 5.44246L14.1214 5.05C13.1444 4.2352 11.9235 3.70566 10.5859 3.58438V4.14062C10.5859 4.46449 10.3239 4.72656 10 4.72656C9.67613 4.72656 9.41406 4.46449 9.41406 4.14062V3.58438C8.07645 3.70566 6.85559 4.2352 5.87863 5.05L6.27109 5.44246C6.50012 5.67148 6.50012 6.04207 6.27109 6.27109C6.04215 6.50012 5.67148 6.50012 5.44246 6.27109L5.05 5.87863C4.2352 6.85559 3.70566 8.07648 3.58438 9.41406H4.14062C4.46449 9.41406 4.72656 9.67613 4.72656 10C4.72656 10.3239 4.46449 10.5859 4.14062 10.5859H3.58438C3.70566 11.9236 4.2352 13.1443 5.05 14.1213L5.44246 13.7288C5.67148 13.4999 6.04215 13.4999 6.27109 13.7288C6.50012 13.9579 6.50012 14.3285 6.27109 14.5575L5.87863 14.95C6.85559 15.7648 8.07648 16.2943 9.41406 16.4156V15.8594C9.41406 15.5355 9.67613 15.2734 10 15.2734C10.3239 15.2734 10.5859 15.5355 10.5859 15.8594V16.4156C11.9236 16.2943 13.1444 15.7648 14.1214 14.95L13.7289 14.5575C13.4999 14.3285 13.4999 13.9579 13.7289 13.7288C13.9579 13.4999 14.3285 13.4999 14.5575 13.7288L14.95 14.1213C15.7648 13.1443 16.2943 11.9235 16.4156 10.5859H15.8594ZM11.5861 11.5861C11.3572 11.815 10.9865 11.815 10.7576 11.5861L9.5857 10.4143C9.47586 10.3044 9.41406 10.1556 9.41406 10V7.65625C9.41406 7.33238 9.67613 7.07031 10 7.07031C10.3239 7.07031 10.5859 7.33238 10.5859 7.65625V9.75738L11.5861 10.7576C11.815 10.9864 11.815 11.3573 11.5861 11.5861Z" fill="var(--icons)"/>
                </svg>
            );
        case 'orders':
            return (
                <svg width="21" height="19" className={props.className} viewBox="0 0 21 19" fill="none">
                    <path d="M6.84 17.355H13.32V18.075H6.84V17.355Z" fill="var(--icons)"/>
                    <path d="M8.59781 14.475L8.32781 16.635H11.8322L11.5622 14.475H8.59781Z" fill="var(--icons)"/>
                    <path d="M3.96 4.39495H6.12V3.46401L5.65453 3.92948C5.51391 4.06993 5.28609 4.06993 5.14547 3.92948L4.42547 3.20948L4.93453 2.70042L5.4 3.16589L6.12 2.44589V2.23495H3.96V4.39495Z" fill="var(--icons)"/>
                    <path d="M20.16 1.15495C20.16 0.558525 19.6764 0.0749512 19.08 0.0749512H1.08C0.483574 0.0749512 0 0.558525 0 1.15495V10.875H20.16V1.15495ZM9.36 2.23495H13.68V2.95495H9.36V2.23495ZM9.36 6.55495H10.8V7.27495H9.36V6.55495ZM6.84 7.06401V9.07495C6.84 9.27376 6.67881 9.43495 6.48 9.43495H3.6C3.40119 9.43495 3.24 9.27376 3.24 9.07495V6.19495C3.24 5.99614 3.40119 5.83495 3.6 5.83495H6.48C6.63012 5.83548 6.76389 5.92987 6.81486 6.07103L7.30547 5.58042L7.81453 6.08948L6.84 7.06401ZM6.84 2.74401V4.75495C6.84 4.95376 6.67881 5.11495 6.48 5.11495H3.6C3.40119 5.11495 3.24 4.95376 3.24 4.75495V1.87495C3.24 1.67614 3.40119 1.51495 3.6 1.51495H6.48C6.63012 1.51548 6.76389 1.60987 6.81486 1.75103L7.30547 1.26042L7.81453 1.76948L6.84 2.74401ZM15.84 9.43495H9.36V8.71495H15.84V9.43495ZM15.84 7.27495H11.52V6.55495H15.84V7.27495ZM15.84 5.11495H9.36V4.39495H15.84V5.11495Z" fill="var(--icons)"/>
                    <path d="M3.96 8.71495H6.12V7.78401L5.65453 8.24948C5.51391 8.38993 5.28609 8.38993 5.14547 8.24948L4.42547 7.52948L4.93453 7.02042L5.4 7.48589L6.12 6.76589V6.55495H3.96V8.71495Z" fill="var(--icons)"/>
                    <path d="M20.16 11.595H0V12.675C0 13.2714 0.483574 13.755 1.08 13.755H19.08C19.6764 13.755 20.16 13.2714 20.16 12.675V11.595ZM18.6156 12.9305C18.5465 12.9963 18.4553 13.0335 18.36 13.035C18.3359 13.0344 18.3118 13.032 18.2879 13.0277C18.2654 13.0239 18.2436 13.0165 18.2232 13.0061C18.2002 12.9982 18.1784 12.9873 18.1584 12.9738C18.1396 12.9604 18.1215 12.946 18.1044 12.9305C17.9652 12.7885 17.9652 12.5614 18.1044 12.4194C18.2087 12.3186 18.3626 12.2891 18.4968 12.3438C18.5404 12.3621 18.5806 12.3875 18.6156 12.4194C18.7548 12.5614 18.7548 12.7885 18.6156 12.9305Z" fill="var(--icons)"/>
                </svg>
            );
        case 'wallets':
            return (
                <svg width="19" height="18" viewBox="0 0 19 18" className={props.className} fill="none">
                    <path d="M12.2041 1.24644C12.2543 1.20963 12.3053 1.20182 12.3395 1.20182C12.3749 1.20182 12.4637 1.21136 12.526 1.29633L14.262 3.6643H15.771L13.5077 0.576756C13.0537 -0.0422565 12.1057 -0.189769 11.4842 0.26539L10.6653 0.865545L11.3849 1.8472L12.2041 1.24644Z" fill="var(--icons)"/>
                    <path d="M8.01857 1.24697C8.06876 1.21015 8.12011 1.20178 8.15429 1.20178C8.18964 1.20178 8.27844 1.21132 8.34079 1.29629L10.0768 3.66427H11.5858L9.32245 0.576718C8.86815 -0.0422941 7.92098 -0.189807 7.299 0.265353L2.6609 3.66427H4.71973L8.01857 1.24697Z" fill="var(--icons)"/>
                    <path d="M9.82043 11.4406C9.82043 9.95096 11.0323 8.73878 12.5219 8.73878H17.0937V5.99472C17.0937 5.38036 16.5952 4.88114 15.9804 4.88114H1.11328C0.49847 4.8811 0 5.38029 0 5.99468V16.8864C0 17.5015 0.49847 18 1.11328 18H15.9804C16.5952 18 17.0937 17.5015 17.0937 16.8864V14.1423H12.5219C11.0323 14.1424 9.82043 12.9302 9.82043 11.4406Z" fill="var(--icons)"/>
                    <path d="M17.6953 9.65147H12.5219C11.5341 9.65147 10.7331 10.4525 10.7331 11.4406C10.7331 12.4289 11.5341 13.2297 12.5219 13.2297H17.6954C18.0217 13.2297 18.2863 12.9647 18.2863 12.6391V10.2426C18.2863 9.91644 18.0216 9.65147 17.6953 9.65147Z" fill="var(--icons)"/>
                </svg>
            );
        case 'p2p-trade':
            return (
                <svg xmlns="http://www.w3.org/2000/svg" className={props.className} width="19" height="18" viewBox="0 0 329.312 329.311">
                    <path d="M275.342,199.306c-8.328,7.849-18.561,13.644-29.939,16.67c10.664,16.892,17.948,36.208,20.639,57.105
                        c0.516,4.035-0.229,7.95-1.946,11.499h58.541c1.874,0,3.705-0.858,5.008-2.348c1.249-1.418,1.844-3.23,1.622-4.96
                        C324.947,243.633,303.799,214.913,275.342,199.306z"/>
                    <path d="M207.83,176.242c2.342,1.663,4.594,3.441,6.821,5.242c2.24,1.813,4.456,3.651,6.575,5.597
                        c6.035,5.513,11.59,11.541,16.604,18.032c9.476-1.729,18.146-5.771,25.4-11.535c1.825-1.453,3.572-2.984,5.206-4.636
                        c1.531-1.549,2.948-3.206,4.294-4.912c7.722-9.812,12.369-22.139,12.369-35.56c0-31.771-25.851-57.622-57.622-57.622
                        c-6.677,0-13.066,1.198-19.035,3.302c2.084,7.341,3.272,15.057,3.272,23.059c0,19.053-6.395,36.602-17.053,50.77
                        C199.201,170.513,203.608,173.234,207.83,176.242z"/>
                    <path d="M121.58,284.581h10.761h111.902c2.925,0,5.669-1.219,7.536-3.333c1.64-1.855,2.372-4.203,2.054-6.599
                        c-2.679-20.915-10.395-40.082-21.708-56.487c-1.393-2.012-2.804-4.005-4.299-5.933c-1.718-2.198-3.543-4.3-5.387-6.39
                        c-5.296-5.969-11.108-11.438-17.396-16.327c-2.149-1.675-4.365-3.26-6.623-4.791c-2.204-1.496-4.408-2.973-6.702-4.33
                        c-1.717-1.021-3.488-1.957-5.26-2.9c-1.735,1.724-3.543,3.369-5.428,4.942c-1.58,1.309-3.243,2.51-4.918,3.711
                        c-1.658,1.188-3.375,2.3-5.123,3.362c-0.834,0.511-1.65,1.045-2.51,1.525c-0.258,0.145-0.498,0.318-0.756,0.457
                        c-12.106,6.677-25.995,10.496-40.77,10.496c-23.182,0-44.198-9.374-59.517-24.5c-35.773,19.006-61.9,54.523-67.368,97.122
                        c-0.312,2.413,0.426,4.768,2.078,6.647c1.858,2.107,4.6,3.326,7.509,3.326h105.111H121.58z"/>
                    <path d="M74.707,167.295c1.519,1.579,3.11,3.086,4.765,4.527c12.733,11.085,29.312,17.852,47.483,17.852
                        c13.823,0,26.709-3.963,37.716-10.706c1.763-1.087,3.474-2.233,5.131-3.453c1.598-1.177,3.146-2.396,4.63-3.692
                        c0.102-0.09,0.198-0.187,0.3-0.271c1.544-1.356,3.039-2.769,4.462-4.257c1.507-1.574,2.954-3.195,4.317-4.9
                        c9.932-12.403,15.913-28.1,15.913-45.195c0-6.092-0.835-11.977-2.264-17.639c-0.523-2.072-1.117-4.107-1.814-6.107
                        c-0.684-1.96-1.435-3.891-2.275-5.779c-11.331-25.271-36.674-42.943-66.116-42.943c-39.956,0-72.466,32.51-72.466,72.469
                        c0,17.09,5.978,32.786,15.907,45.189C71.755,164.1,73.2,165.721,74.707,167.295z"/>
                </svg>
            );
        case 'savings':
            return (
                <svg className={props.className} width="19" height="18" viewBox="-37 0 471 471.7209" xmlns="http://www.w3.org/2000/svg">
                    <path d="m104.007812 221.5c0 55.785156 45.222657 101.007812 101.007813 101.007812s101.007813-45.222656 101.007813-101.007812-45.222657-101.007812-101.007813-101.007812c-55.757813.0625-100.945313 45.25-101.007813 101.007812zm101.007813 6.382812c-16.761719.09375-30.964844-12.320312-33.109375-28.945312-2.144531-16.621094 8.441406-32.238281 24.679688-36.398438v-8.539062c0-3.867188 3.132812-7 7-7 3.867187 0 7 3.132812 7 7v8.113281c15.882812 2.6875 27.476562 16.496094 27.375 32.609375 0 3.820313-3.097657 6.917969-6.917969 6.917969-3.820313 0-6.917969-3.097656-6.917969-6.917969-.011719-10.574218-8.589844-19.136718-19.164062-19.125-10.574219.011719-19.136719 8.59375-19.121094 19.167969.011718 10.570313 8.59375 19.132813 19.167968 19.117187 17.144532.097657 31.382813 13.253907 32.832032 30.339844 1.449218 17.082032-10.371094 32.449219-27.253906 35.433594v8.34375c0 3.867188-3.132813 7-7 7-3.867188 0-7-3.132812-7-7v-8.773438c-14.628907-3.863281-24.851563-17.050781-24.949219-32.179687 0-3.910156 3.171875-7.082031 7.082031-7.082031s7.082031 3.171875 7.082031 7.082031c.023438 9.777344 7.390625 17.976563 17.109375 19.042969.359375-.058594.726563-.085938 1.09375-.089844.527344 0 1.050782.0625 1.566406.179688 10.5-.257813 18.832032-8.921876 18.679688-19.421876-.152344-10.503906-8.734375-18.921874-19.234375-18.875zm0 0"/>
                    <path d="m367.121094 370.667969c-.050782.027343-.105469.054687-.164063.082031l-64.980469 30.699219c.699219 3.597656 1.003907 7.257812.90625 10.921875-.101562 3.789062-3.203124 6.808594-6.992187 6.808594-.066406 0-.132813 0-.199219 0l-95.101562-2.617188c-3.867188-.105469-6.914063-3.324219-6.808594-7.191406.105469-3.867188 3.328125-6.914063 7.191406-6.808594l87.417969 2.40625c-2.898437-16.941406-17.34375-29.488281-34.523437-29.988281l-57.851563-1.589844c-11.425781-.328125-22.628906-3.222656-32.78125-8.46875l-5.886719-3.046875c-28.910156-15.0625-63.746094-13.101562-90.78125 5.113281l-2.316406 84.160157 9.941406-5.324219c9.878906-5.3125 21.4375-6.578125 32.234375-3.527344l98.179688 27.558594c18.921875 3.875 38.585937 1.679687 56.1875-6.28125l136.019531-87.984375c-7.761719-7.945313-19.78125-9.941406-29.691406-4.921875zm0 0"/>
                    <path d="m.359375 465.765625 3.449219-125.214844 49.445312 1.363281-3.449218 125.214844zm0 0"/>
                    <path d="m211.585938 83v-76c0-3.867188-3.132813-7-7-7-3.867188 0-7 3.132812-7 7v76c0 3.867188 3.132812 7 7 7 3.867187 0 7-3.132812 7-7zm0 0"/>
                    <path d="m271.585938 83v-36c0-3.867188-3.132813-7-7-7-3.867188 0-7 3.132812-7 7v36c0 3.867188 3.132812 7 7 7 3.867187 0 7-3.132812 7-7zm0 0"/>
                    <path d="m151.585938 83v-36c0-3.867188-3.132813-7-7-7-3.867188 0-7 3.132812-7 7v36c0 3.867188 3.132812 7 7 7 3.867187 0 7-3.132812 7-7zm0 0"/>
                </svg>
            );
        case 'swap':
            return (
                <svg width="19" height="18" className={props.className} viewBox="0 0 511.624 511.623" fill="none">

                   <path d="M9.135,200.996h392.862v54.818c0,2.475,0.9,4.613,2.707,6.424c1.811,1.81,3.953,2.713,6.427,2.713
                       c2.666,0,4.856-0.855,6.563-2.569l91.365-91.362c1.707-1.713,2.563-3.903,2.563-6.565c0-2.667-0.856-4.858-2.57-6.567
                       l-91.07-91.078c-2.286-1.906-4.572-2.856-6.858-2.856c-2.662,0-4.853,0.856-6.563,2.568c-1.711,1.715-2.566,3.901-2.566,6.567
                       v54.818H9.135c-2.474,0-4.615,0.903-6.423,2.712S0,134.568,0,137.042v54.818c0,2.474,0.903,4.615,2.712,6.423
                       S6.661,200.996,9.135,200.996z"/>
                   <path d="M502.49,310.637H109.632v-54.82c0-2.474-0.905-4.615-2.712-6.423c-1.809-1.809-3.951-2.712-6.424-2.712
                       c-2.667,0-4.854,0.856-6.567,2.568L2.568,340.607C0.859,342.325,0,344.509,0,347.179c0,2.471,0.855,4.568,2.568,6.275
                       l91.077,91.365c2.285,1.902,4.569,2.851,6.854,2.851c2.473,0,4.615-0.903,6.423-2.707c1.807-1.813,2.712-3.949,2.712-6.427V383.72
                       H502.49c2.478,0,4.613-0.899,6.427-2.71c1.807-1.811,2.707-3.949,2.707-6.427v-54.816c0-2.475-0.903-4.613-2.707-6.42
                       C507.103,311.54,504.967,310.637,502.49,310.637z"/>
           </svg>
            );
        case 'trade':
            return (
                <svg width="18" height="18" viewBox="0 0 18 18" className={props.className} fill="none">
                    <path d="M18 16.9453H0V18H18V16.9453Z" fill="var(--icons)"/>
                    <path d="M13.2363 3.5332H9.52734V15.8906H13.2363V3.5332Z" fill="var(--icons)"/>
                    <path d="M18 0H14.291V15.8906H18V0Z" fill="var(--icons)"/>
                    <path d="M8.47266 7.06641H4.76367V15.8906H8.47266V7.06641Z" fill="var(--icons)"/>
                    <path d="M3.70898 10.5996H0V15.8906H3.70898V10.5996Z" fill="var(--icons)"/>
                </svg>
            );
        case 'logout':
            return (
                <svg width="24" height="24" viewBox="0 0 24 24" className={props.className} fill="none">
                    <path d="M11.9668 20.3057H4.49168C4.0332 20.3057 3.66113 19.9336 3.66113 19.4751V4.52492C3.66113 4.06645 4.03324 3.69438 4.49168 3.69438H11.9668C12.4261 3.69438 12.7973 3.32313 12.7973 2.86383C12.7973 2.40453 12.4261 2.0332 11.9668 2.0332H4.49168C3.11793 2.0332 2 3.15117 2 4.52492V19.4751C2 20.8488 3.11793 21.9668 4.49168 21.9668H11.9668C12.4261 21.9668 12.7973 21.5955 12.7973 21.1362C12.7973 20.6769 12.4261 20.3057 11.9668 20.3057Z" fill="var(--icons)"/>
                    <path d="M21.7525 11.4085L16.7026 6.42515C16.3771 6.10288 15.8505 6.10706 15.5282 6.43347C15.206 6.75988 15.2093 7.28562 15.5366 7.60788L19.1453 11.1693H9.47508C9.01578 11.1693 8.64453 11.5406 8.64453 11.9999C8.64453 12.4592 9.01578 12.8305 9.47508 12.8305H19.1453L15.5366 16.3919C15.2093 16.7142 15.2068 17.2399 15.5282 17.5663C15.691 17.7308 15.9053 17.8138 16.1196 17.8138C16.3306 17.8138 16.5415 17.7341 16.7026 17.5746L21.7525 12.5912C21.9103 12.4351 22 12.2224 22 11.9998C22 11.7773 21.9111 11.5655 21.7525 11.4085Z" fill="var(--icons)"/>
                </svg>
            );
        case 'signin':
            return (
                <svg width="24" height="24" viewBox="0 0 24 24" className={props.className} fill="none">
                    <path d="M12.1909 20.4697C9.31592 20.4697 6.77442 18.9977 5.29092 16.7897C5.32542 14.4897 9.89092 13.2247 12.1909 13.2247C14.4909 13.2247 19.0564 14.4897 19.0909 16.7897C17.6074 18.9977 15.0659 20.4697 12.1909 20.4697ZM12.1909 4.1397C13.1059 4.1397 13.9834 4.50318 14.6304 5.15018C15.2774 5.79718 15.6409 6.6747 15.6409 7.5897C15.6409 8.50469 15.2774 9.38222 14.6304 10.0292C13.9834 10.6762 13.1059 11.0397 12.1909 11.0397C11.2759 11.0397 10.3984 10.6762 9.7514 10.0292C9.1044 9.38222 8.74092 8.50469 8.74092 7.5897C8.74092 6.6747 9.1044 5.79718 9.7514 5.15018C10.3984 4.50318 11.2759 4.1397 12.1909 4.1397ZM12.1909 0.689697C10.6807 0.689697 9.1853 0.987154 7.79006 1.56508C6.39481 2.14301 5.12706 2.9901 4.05919 4.05797C1.90252 6.21464 0.690918 9.13971 0.690918 12.1897C0.690918 15.2397 1.90252 18.1648 4.05919 20.3214C5.12706 21.3893 6.39481 22.2364 7.79006 22.8143C9.1853 23.3922 10.6807 23.6897 12.1909 23.6897C15.2409 23.6897 18.166 22.4781 20.3226 20.3214C22.4793 18.1648 23.6909 15.2397 23.6909 12.1897C23.6909 5.8302 18.5159 0.689697 12.1909 0.689697Z" fill="var(--icons)"/>
                </svg>
            );
        case 'signup':
            return (
                <svg width="24" height="21" viewBox="0 0 24 21" className={props.className} fill="none">
                    <path fillRule="evenodd" clipRule="evenodd" d="M15.9005 10.6591C15.229 10.1907 14.5115 9.80893 13.761 9.5173C14.7593 8.60992 15.4216 7.33884 15.5368 5.91586C15.5368 5.91586 15.5637 5.31531 15.4498 4.58983C15.336 3.86436 15.1618 3.43362 15.1618 3.43362C14.3524 1.42298 12.382 0 10.0852 0C7.06913 0 4.61517 2.45375 4.61517 5.46982C4.61517 7.06124 5.29837 8.49574 6.38655 9.49614C3.47712 10.5862 1.11807 12.9275 0.157685 15.9134C-0.160766 16.9035 0.00788724 17.9535 0.620487 18.7943C1.23309 19.6348 2.1809 20.1169 3.22089 20.1169H12.5522C13.1444 20.1169 13.6246 19.6367 13.6246 19.0442C13.6246 18.452 13.1444 17.9718 12.5522 17.9718H3.22089C2.87416 17.9718 2.55822 17.8111 2.35395 17.5308C2.14968 17.2504 2.09353 16.9003 2.19955 16.5702C3.25965 13.2742 6.49277 10.9723 10.0617 10.9723C11.7223 10.9723 13.3171 11.4724 14.6734 12.4184C15.1593 12.7573 15.8278 12.6381 16.1668 12.1523C16.5056 11.6664 16.3866 10.9979 15.9005 10.6591ZM13.4101 5.46982C13.4101 3.63663 11.9186 2.14494 10.0852 2.14494C8.2518 2.14494 6.76031 3.63663 6.76031 5.46982C6.76031 7.30322 8.2518 8.79471 10.0852 8.79471C11.9186 8.79471 13.4101 7.30322 13.4101 5.46982Z" fill="var(--icons)"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M22.9273 16.3563C23.5198 16.3563 24 15.8761 24 15.2838C24 14.6913 23.5198 14.2112 22.9273 14.2112H19.9779V11.2617C19.9779 10.6694 19.4977 10.1892 18.9054 10.1892C18.3129 10.1892 17.8327 10.6694 17.8327 11.2617V14.2112H14.8833C14.291 14.2112 13.8108 14.6913 13.8108 15.2838C13.8108 15.8761 14.291 16.3563 14.8833 16.3563H17.8327V19.3057C17.8327 19.8982 18.3129 20.3784 18.9054 20.3784C19.4977 20.3784 19.9779 19.8982 19.9779 19.3057V16.3563H22.9273Z" fill="var(--icons)"/>
                </svg>
            );
        default:
            return null;
    }
};
